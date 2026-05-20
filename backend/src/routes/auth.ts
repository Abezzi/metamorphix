import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  updateUserHandler,
  refreshHandler,
  revokeHandler,
} from "./handlers/auth.handlers.js";

const authRouter = Router();

authRouter.post("/sign-up", createUserHandler);
authRouter.post("/sign-in", loginHandler);
authRouter.put("/profile", updateUserHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/revoke", revokeHandler);

export default authRouter;
