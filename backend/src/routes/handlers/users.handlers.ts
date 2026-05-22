import { Response } from "express";
import { UserService } from "../../db/queries/users.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.js";

const service = new UserService();

// delete user
export const deleteUserHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      respondWithError(res, 400, "Valid user ID is required");
      return;
    }

    await service.delete(id);

    respondWithJSON(res, 204, null);
  },
);
