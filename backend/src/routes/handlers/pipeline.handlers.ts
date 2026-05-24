import { Request, Response } from "express";
import { PipelineService } from "../../db/queries/pipelines.js";
import {
  CreatePipelineDto,
  UpdatePipelineDto,
} from "../../types/pipeline.types.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.js";

const service = new PipelineService();

// create
export const createPipelineHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const { name, actionType, actionConfig, subscribers } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      respondWithError(
        res,
        400,
        "Name is required and must be a non-empty string",
      );
      return;
    }

    if (!actionType || typeof actionType !== "string") {
      respondWithError(res, 400, "actionType is required");
      return;
    }

    const validActionTypes = [
      "transform",
      "filter",
      "enrich",
      "webhook-forward",
    ];
    if (!validActionTypes.includes(actionType)) {
      respondWithError(
        res,
        400,
        `actionType must be one of: ${validActionTypes.join(", ")}`,
      );
      return;
    }

    const createData: CreatePipelineDto = {
      name: name.trim(),
      actionType: actionType as any,
      actionConfig: actionConfig || {},
      subscribers: subscribers || [],
    };

    const pipeline = await service.create(createData, user.id);

    if (!pipeline) {
      respondWithError(res, 400, "Failed to create pipeline");
      return;
    }

    respondWithJSON(res, 201, pipeline);
  },
);

// get all
export const getAllPipelinesHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const {
      pageIndex = 1,
      pageSize = 10,
      sort = "createdAt",
      order = "desc",
      query = "",
      filterData,
    } = req.query;

    const page = Number(pageIndex);
    const limit = Number(pageSize);
    const offset = (page - 1) * limit;

    const { data, total } = await service.getAllPipelines({
      page,
      limit,
      offset,
      sort: String(sort),
      order: order === "asc" ? "asc" : "desc",
      search: String(query),
      filterData: filterData ? JSON.parse(String(filterData)) : undefined,
      userId: user.id,
    });

    respondWithJSON(res, 200, {
      // Pipeline[] in frontend
      data,
      // number (total count before pagination)
      total,
    });
  },
);

// get by id
export const getPipelineByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid pipeline ID is required");
      return;
    }

    const pipeline = await service.getById(id);

    if (!pipeline) {
      respondWithError(res, 404, "Pipeline not found");
      return;
    }

    respondWithJSON(res, 200, pipeline);
  },
);

// update
export const updatePipelineHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, actionType, actionConfig, isActive } = req.body;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid pipeline ID is required");
      return;
    }

    if (
      !name &&
      !actionType &&
      actionConfig === undefined &&
      isActive === undefined
    ) {
      respondWithError(res, 400, "At least one field to update is required");
      return;
    }

    const updateData: UpdatePipelineDto = {};

    if (name !== undefined)
      updateData.name = typeof name === "string" ? name.trim() : name;
    if (actionType !== undefined) updateData.actionType = actionType;
    if (actionConfig !== undefined) updateData.actionConfig = actionConfig;
    if (isActive !== undefined) updateData.isActive = isActive;

    const pipeline = await service.update(id, updateData);

    if (!pipeline) {
      respondWithError(res, 404, "Pipeline not found");
      return;
    }

    respondWithJSON(res, 200, pipeline);
  },
);

// delete
export const deletePipelineHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid pipeline ID is required");
      return;
    }

    await service.delete(id);
    // no content
    respondWithJSON(res, 204, null);
  },
);

export const getPipelinesStatisticHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    try {
      const statistics = await service.getPipelinesStatistic(user.id);
      respondWithJSON(res, 200, statistics);
    } catch (error) {
      console.error("Error fetching pipelines statistics:", error);
      respondWithJSON(res, 500, { message: "Failed to fetch statistics" });
    }
  },
);
