import { NextFunction, Request, Response } from "express";
import { User } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { respondWithError } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiConfig } from "../config.js";

export interface AuthRequest extends Request {
  user?: User;
}

export const requireAuth = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = getBearerToken(req);
      const userId = validateJWT(token, apiConfig.jwtSecret);
      // attach user to request
      (req as any).user = { id: userId };
      // continue to next handler
      next();
    } catch (error: any) {
      respondWithError(res, 401, error.message || "invalid or expired token");
    }
  },
);
