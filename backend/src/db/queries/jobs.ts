import { db } from "../index.js";
import { jobs, pipelines } from "../schema.js";
import { eq } from "drizzle-orm";
import { Queue } from "bullmq"; // we'll set this up next

// Initialize BullMQ queue (we'll configure this properly soon)
const jobQueue = new Queue("pipeline-jobs", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

export class JobService {
  async createQueuedJob(data: { pipelineId: string; inputPayload: any }) {
    const [job] = await db
      .insert(jobs)
      .values({
        pipelineId: data.pipelineId,
        inputPayload: data.inputPayload,
        status: "queued",
      })
      .returning();

    return job;
  }

  async addToQueue(jobId: string, pipelineId: string) {
    await jobQueue.add(
      "process-pipeline",
      {
        jobId,
        pipelineId,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );
  }

  // We'll add more methods later (getById, getByPipeline, etc.)
  async getById(id: string) {
    return db.query.jobs.findFirst({
      where: eq(jobs.id, id),
      with: { deliveryAttempts: true },
    });
  }

  async getPipelineWithSubscribers(pipelineId: string) {
    return db.query.pipelines.findFirst({
      where: eq(pipelines.id, pipelineId),
      with: { subscribers: true },
    });
  }
}
