import { Request, Response } from "express";
import { SubscriberService } from "../../db/queries/subscribers.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.js";
import { parseFilterData } from "../../utils/queryParser.js";

const service = new SubscriberService();

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
