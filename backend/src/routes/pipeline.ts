import { Router } from "express";
import {
  createPipelineHandler,
  deletePipelineHandler,
  getAllPipelinesHandler,
  getPipelineByIdHandler,
  updatePipelineHandler,
} from "./handlers/pipeline.handlers.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, createPipelineHandler);
router.get("/", requireAuth, getAllPipelinesHandler);
router.get("/:id", requireAuth, getPipelineByIdHandler);
router.patch("/:id", requireAuth, updatePipelineHandler);
router.delete("/:id", requireAuth, deletePipelineHandler);

export default router;
