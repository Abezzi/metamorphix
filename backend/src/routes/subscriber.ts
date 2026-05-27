import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  createSubscriberHandler,
  deleteSubscriberHandler,
  getAllSubscribersHandler,
  getSubscriberByIdHandler,
  updateSubscriberHandler,
} from "./handlers/subscriber.handlers.js";

const router = Router();

router.post("/", requireAuth, createSubscriberHandler);
router.get("/", requireAuth, getAllSubscribersHandler);
// router.get("/subscribers-statistic", requireAuth, getSubscriberByIdHandler);

router.get("/:id", requireAuth, getSubscriberByIdHandler);
router.patch("/:id", requireAuth, updateSubscriberHandler);
router.delete("/:id", requireAuth, deleteSubscriberHandler);

export default router;
