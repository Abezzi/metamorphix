import { Router } from "express";
import { readinessHandler } from "./handlers/health.handlers.js";

const healthRouter = Router();

healthRouter.get("/healthz", readinessHandler);
healthRouter.get("/ready", readinessHandler);

export default healthRouter;
