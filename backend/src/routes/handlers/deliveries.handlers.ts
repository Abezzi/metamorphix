import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.js";
import { parseFilterData } from "../../utils/queryParser.js";
import { DeliveryService } from "../../db/queries/deliveries.js";

const service = new DeliveryService();

// get all
export const getAllDeliveriesHandler = asyncHandler(
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

    const { data, total } = await service.getAllDeliveries({
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
export const getDeliveryAttemptByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid delivery attempt ID is required");
      return;
    }

    const delivery = await service.getById(id);

    if (!delivery) {
      respondWithError(res, 404, "Delivery not found");
      return;
    }

    respondWithJSON(res, 200, delivery);
  },
);
