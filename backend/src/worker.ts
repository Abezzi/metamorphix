import { Worker, Job as BullJob } from "bullmq";
import { processPipelineJob } from "./db/queries/actionProcessor.js";
import { db } from "./db/index.js";
import { pipelines, subscribers } from "./db/schema.js";
import { eq, inArray } from "drizzle-orm";
import { deliveryService } from "./db/queries/deliveries.js";

// initialize the background worker
const worker = new Worker(
  "pipeline-jobs",
  async (bullJob: BullJob) => {
    const { jobId, pipelineId } = bullJob.data as {
      jobId: string;
      pipelineId: string;
    };

    console.log(
      `[Worker] 🚀 Started processing job ${jobId} for pipeline ${pipelineId}`,
    );

    try {
      // 1. Process the action
      const result = await processPipelineJob(jobId, pipelineId);

      // 2. Fetch pipeline + subscribers
      const pipeline = await db.query.pipelines.findFirst({
        where: eq(pipelines.id, pipelineId),
        columns: { id: true, name: true, subscribersIds: true },
      });

      if (!pipeline) throw new Error(`Pipeline ${pipelineId} not found`);

      console.log(`[Worker] Pipeline subscribersIds:`, pipeline.subscribersIds);

      // 3. Fetch valid subscribers
      let subscriberList: any[] = [];

      if (pipeline.subscribersIds?.length > 0) {
        const rawSubs = await db.query.subscribers.findMany({
          where: inArray(subscribers.id, pipeline.subscribersIds),
        });

        subscriberList = rawSubs.filter(
          (sub): sub is any =>
            sub != null && Boolean(sub?.id) && Boolean(sub?.url?.trim()),
        );

        console.log(
          `[Worker] Valid subscribers: ${subscriberList.length}/${rawSubs.length}`,
        );
        console.log(
          `[Worker] Subscribers:`,
          subscriberList.map((s) => ({ id: s.id, url: s.url })),
        );
      }

      // 4. Deliver
      if (subscriberList.length > 0 && result.outputPayload) {
        console.log(
          `[Worker] 📤 Delivering to ${subscriberList.length} subscriber(s)`,
        );
        await deliveryService.deliverWithRetry(
          jobId,
          subscriberList,
          result.outputPayload,
        );
        console.log(`[Worker] 📬 Delivery completed`);
      } else {
        console.log(`[Worker] ⚠️ No valid subscribers for this pipeline`);
      }

      console.log(`[Worker] ✅ Job ${jobId} completed successfully`);
    } catch (error: any) {
      console.error(`[Worker] ❌ Job ${jobId} failed:`, error.message);
      throw error;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    concurrency: 5,
    limiter: { max: 50, duration: 10000 },
  },
);

// event listeners for better observability
worker.on("completed", (job) => {
  console.log(`[Worker] 🎉 Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(
    `[Worker] 💥 Job ${job?.id} failed after retries:`,
    err.message,
  );
});

worker.on("error", (err) => {
  console.error("[Worker] Worker error:", err);
});

worker.on("ready", () => {
  console.log("🚀 Metamorphix Worker is ready and listening for jobs...");
});

// graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Worker] Shutting down gracefully...");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Worker] Shutting down gracefully...");
  await worker.close();
  process.exit(0);
});

export default worker;
