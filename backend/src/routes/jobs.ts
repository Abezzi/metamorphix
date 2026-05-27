import { Router } from "express";
import { getJobByIdHandler } from "./handlers/job.handlers.js";

const router = Router();

router.get("/:id", getJobByIdHandler);
// router.get("/", requireAuth, getAllPipelinesHandler);

export default router;
