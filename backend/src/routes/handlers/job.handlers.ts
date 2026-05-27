import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { JobService } from "../../db/queries/jobs.js";

const jobService = new JobService();

// get by id
export const getJobByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid job ID is required");
      return;
    }

    const job = await jobService.getById(id);

    if (!job) {
      respondWithError(res, 404, "Pipeline not found");
      return;
    }

    respondWithJSON(res, 200, job);
  },
);
