import { NextFunction, Request, Response } from "express";
import { User } from "../db/schema.js";
import { getAPIKey } from "../auth.js";
import { getUserByApiKey } from "../db/queries/users.js";
import { respondWithError } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface AuthRequest extends Request {
  user?: User;
}

export const requireAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const apiKey = getAPIKey(req.headers);

    if (!apiKey) {
      respondWithError(res, 401, "API key is required");
      return;
    }

    const user = await getUserByApiKey(apiKey);

    if (!user) {
      respondWithError(res, 401, "Invalid API key");
      return;
    }
    // attach user to request
    req.user = user;
    // continue to next handler
    next();
  },
);
