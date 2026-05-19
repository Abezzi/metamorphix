import { Request, Response, NextFunction } from "express";

// middleware that logs non-ok
export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
};
