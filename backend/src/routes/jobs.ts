import { Router } from "express";
import {
  getAllJobsHandler,
  getJobByIdHandler,
} from "./handlers/job.handlers.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, getAllJobsHandler);
router.get("/:id", getJobByIdHandler);

export default router;
