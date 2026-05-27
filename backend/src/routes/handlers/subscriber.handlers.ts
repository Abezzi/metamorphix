import { Request, Response } from "express";
import { SubscriberService } from "../../db/queries/subscribers.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.js";
import { parseFilterData } from "../../utils/queryParser.js";
import {
  CreateSubscriberDto,
  UpdateSubscriberDto,
} from "../../types/subscriber.types.js";

const service = new SubscriberService();

// create
export const createSubscriberHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const { url, method, headers } = req.body;

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      respondWithError(
        res,
        400,
        "URL is required and must be a non-empty string",
      );
      return;
    }

    const validMethods = ["POST", "GET", "UPDATE", "DELETE", "PATCH"];
    if (!validMethods.includes(method)) {
      respondWithError(
        res,
        400,
        `actionType must be one of: ${validMethods.join(", ")}`,
      );
      return;
    }

    const createData: CreateSubscriberDto = {
      url: url,
      method: method as any,
      headers: headers || {},
    };

    const subscriber = await service.create(createData, user.id);

    if (!subscriber) {
      respondWithError(res, 400, "Failed to create subscriber");
      return;
    }

    respondWithJSON(res, 201, subscriber);
  },
);

// get all
export const getAllSubscribersHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const { pageIndex = 1, pageSize = 10, query = "" } = req.query;

    const page = Number(pageIndex);
    const limit = Number(pageSize);
    const offset = (page - 1) * limit;
    const filterData = parseFilterData(req.query);

    // parse sort
    const sortKey = req.query["sort[key]"] || "createdAt";
    const sortOrder = (req.query["sort[order]"] as string) || "desc";

    const { data, total } = await service.getAllSubscribers({
      page,
      limit,
      offset,
      sort: String(sortKey),
      order: sortOrder === "asc" ? "asc" : "desc",
      search: String(query),
      filterData,
      userId: user.id,
    });

    respondWithJSON(res, 200, {
      data,
      // number (total count before pagination)
      total,
    });
  },
);

// get by id
export const getSubscriberByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid subscriber ID is required");
      return;
    }

    const subscriber = await service.getById(id);

    if (!subscriber) {
      respondWithError(res, 404, "Subscriber not found");
      return;
    }

    respondWithJSON(res, 200, subscriber);
  },
);

// update
export const updateSubscriberHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { url, method, headers } = req.body;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid subscriber ID is required");
      return;
    }

    if (!url && !method && headers === undefined) {
      respondWithError(res, 400, "At least one field to update is required");
      return;
    }

    const updateData: UpdateSubscriberDto = {};

    if (url !== undefined) updateData.url = url;
    if (method !== undefined) updateData.method = method;
    if (headers !== undefined) updateData.headers = headers;

    const subscriber = await service.update(id, updateData);

    if (!subscriber) {
      respondWithError(res, 404, "Subscriber not found");
      return;
    }

    respondWithJSON(res, 200, subscriber);
  },
);

// delete
export const deleteSubscriberHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid subscriber ID is required");
      return;
    }

    await service.delete(id);
    // no content
    respondWithJSON(res, 204, null);
  },
);

// export const getSubscribersStatisticHandler = asyncHandler(
//   async (req: AuthRequest, res: Response) => {
//     const user = req.user!;
//
//     try {
//       const statistics = await service.getSubscribersStatistic(user.id);
//       respondWithJSON(res, 200, statistics);
//     } catch (error) {
//       console.error("Error fetching subscribers statistics:", error);
//       respondWithJSON(res, 500, { message: "Failed to fetch statistics" });
//     }
//   },
// );
