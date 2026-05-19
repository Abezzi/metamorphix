import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  updateUserHandler,
  refreshHandler,
  revokeHandler,
} from "./handlers/auth.handlers.js";

const authRouter = Router();

authRouter.post("/register", createUserHandler);
authRouter.post("/login", loginHandler);
authRouter.put("/profile", updateUserHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/revoke", revokeHandler);

export default authRouter;
