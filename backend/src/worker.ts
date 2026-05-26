import { Worker, Job as BullJob } from "bullmq";
import { processPipelineJob } from "./db/queries/actionProcessor.js";

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
      await processPipelineJob(jobId, pipelineId);
      console.log(`[Worker] ✅ Successfully completed job ${jobId}`);
    } catch (error) {
      console.error(`[Worker] ❌ Failed to process job ${jobId}:`, error);
      throw error; // Important: Let BullMQ handle retries
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    concurrency: 5,
    limiter: {
      // max jobs per duration
      max: 50,
      duration: 10000,
    },
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
