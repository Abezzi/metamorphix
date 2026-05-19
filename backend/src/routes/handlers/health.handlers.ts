import { Request, Response } from "express";

export const readinessHandler = (_req: Request, res: Response) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
};
