import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { deleteUserHandler } from "./handlers/users.handlers.js";

const userRouter = Router();

userRouter.delete("/:id", requireAuth, deleteUserHandler);

export default userRouter;
