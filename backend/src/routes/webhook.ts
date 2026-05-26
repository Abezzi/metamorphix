import { Router } from "express";
import { ingestWebhookHandler } from "./handlers/webhook.handlers.js";

const router = Router();

router.post("/:sourceUrl", ingestWebhookHandler);

export default router;
