import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { PipelineService } from "../../db/queries/pipelines.js";
import { JobService } from "../../db/queries/jobs.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";

const pipelineService = new PipelineService();
const jobService = new JobService();

export const ingestWebhookHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { sourceUrl } = req.params;
    // raw payload
    const payload = req.body;

    if (!sourceUrl || typeof sourceUrl !== "string") {
      respondWithError(res, 400, "Source URL is required");
      return;
    }

    if (!payload || Object.keys(payload).length === 0) {
      respondWithError(res, 400, "Webhook payload cannot be empty");
      return;
    }

    // 1. Find pipeline
    const pipeline = await pipelineService.getBySourceUrl(sourceUrl);

    if (!pipeline || !pipeline.isActive) {
      respondWithError(res, 404, "Pipeline not found or inactive");
      return;
    }

    // 2. Create queued job
    const job = await jobService.createQueuedJob({
      pipelineId: pipeline.id,
      inputPayload: payload,
    });

    if (!job) {
      respondWithError(res, 500, "Failed to queue webhook");
      return;
    }

    // 3. Add to background queue (BullMQ)
    await jobService.addToQueue(job.id, pipeline.id);

    // 4. Respond immediately (important!)
    respondWithJSON(res, 200, {
      success: true,
      message: "Webhook accepted and queued successfully",
      jobId: job.id,
    });
  },
);
