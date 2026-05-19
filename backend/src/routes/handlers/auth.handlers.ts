import { Request, Response } from "express";
import { apiConfig } from "../../config.js";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  validateJWT,
} from "../../auth.js";
import {
  createUser,
  getUserByEmail,
  updateUsers,
} from "../../db/queries/users.js";
import {
  createRefreshToken,
  getUserFromRefreshToken,
  revokeRefreshToken,
} from "../../db/queries/tokens.js";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const hashedPasswordHandler = await hashPassword(password);
    const user = await createUser(email, hashedPasswordHandler);

    if (!user) {
      res.status(400).json({ error: "user already exists" });
      return;
    }

    const { hashedPassword, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      res.status(400).json({ error: "password and email are required" });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user || !(await checkPasswordHash(password, user.hashedPassword))) {
      res.status(401).json({ error: "incorrect email or password" });
      return;
    }

    const accessToken = makeJWT(user.id, 3600, apiConfig.jwtSecret);
    const refreshRecord = await createRefreshToken(user.id);

    const { hashedPassword, ...response } = user;

    res.status(200).json({
      id: response.id,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      email: response.email,
      token: accessToken,
      refreshToken: refreshRecord.token,
    });
  } catch (error) {
    res.status(401).json({ error: "incorrect email or password" });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const token = getBearerToken(req);
    const userID = validateJWT(token, apiConfig.jwtSecret);

    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "email is required" });
      return;
    }
    if (!password || typeof password !== "string") {
      res.status(400).json({ error: "password is required" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUsers(email, hashedPassword, userID);

    if (!updatedUser) {
      res.status(404).json({ error: "user not found" });
      return;
    }

    res.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error: any) {
    if (
      error.message.includes("invalid") ||
      error.message.includes("no authorization")
    ) {
      res.status(401).json({ error: "invalid token" });
      return;
    }
    res.status(500).json({ error: "something went wrong" });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshTokenStr = getBearerToken(req);
    const userID = await getUserFromRefreshToken(refreshTokenStr);

    if (!userID) {
      res.status(401).json({ error: "invalid refresh token" });
      return;
    }

    const newAccessToken = makeJWT(userID, 3600, apiConfig.jwtSecret);
    res.status(200).json({ token: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ error: "invalid refresh token" });
  }
};

export const revokeHandler = async (req: Request, res: Response) => {
  try {
    const refreshTokenStr = getBearerToken(req);
    await revokeRefreshToken(refreshTokenStr);
    res.status(204).end();
  } catch (error) {
    res.status(401).json({ error: "invalid refresh token" });
  }
};
