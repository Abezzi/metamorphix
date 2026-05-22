import { Request, Response, NextFunction } from "express";
import { respondWithError } from "./response.js";

export const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.error(`Error in ${fn.name || "handler"}:`, error);

      respondWithError(res, 500, "Something went wrong", error);
    }
  };
};
