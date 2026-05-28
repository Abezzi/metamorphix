import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  getAllDeliveriesHandler,
  getDeliveryAttemptByIdHandler,
} from "./handlers/deliveries.handlers.js";

const router = Router();

router.get("/", requireAuth, getAllDeliveriesHandler);
router.get("/:id", requireAuth, getDeliveryAttemptByIdHandler);

export default router;
