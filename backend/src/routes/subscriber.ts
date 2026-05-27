import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  getAllSubscribersHandler,
  getSubscriberByIdHandler,
} from "./handlers/subscriber.handlers.js";

const router = Router();

router.get("/", requireAuth, getAllSubscribersHandler);
router.get("/:id", requireAuth, getSubscriberByIdHandler);

export default router;
