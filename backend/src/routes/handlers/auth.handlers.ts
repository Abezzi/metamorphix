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
  getUserByUsername,
  updateUsers,
} from "../../db/queries/users.js";
import {
  createRefreshToken,
  getUserFromRefreshToken,
  revokeRefreshToken,
} from "../../db/queries/tokens.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { respondWithError, respondWithJSON } from "../../utils/response.js";
import { generateRandomSHA256Hash } from "../../utils/encryption.js";

// create user
export const createUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, email, username } = req.body;

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string" ||
      !username ||
      typeof username !== "string"
    ) {
      respondWithError(res, 400, "email, username and password are required");
      return;
    }

    const apiKey = generateRandomSHA256Hash();
    const hashedPasswordHandler = await hashPassword(password);
    const user = await createUser(
      email,
      username,
      hashedPasswordHandler,
      ["user"],
      apiKey,
    );

    if (!user) {
      respondWithError(res, 400, "user already exists");
      return;
    }

    const { hashedPassword, ...userResponse } = user;
    respondWithJSON(res, 201, userResponse);
  },
);

// login
export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, username } = req.body;

    if (!password || !username) {
      respondWithError(res, 400, "password and username are required");
      return;
    }

    const user = await getUserByUsername(username);

    if (!user || !(await checkPasswordHash(password, user.hashedPassword))) {
      respondWithError(res, 401, "incorrect username or password");
      return;
    }

    const accessToken = makeJWT(user.id, 3600, apiConfig.jwtSecret);
    const refreshRecord = await createRefreshToken(user.id);

    const { hashedPassword, ...response } = user;

    respondWithJSON(res, 200, {
      id: response.id,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      email: response.email,
      username: response.username,
      authority: response.authority,
      token: accessToken,
      refreshToken: refreshRecord.token,
    });
  },
);

// logout
export const signOutHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const refreshTokenStr = getBearerToken(req);
      await revokeRefreshToken(refreshTokenStr);
    } catch (error) {
      console.warn(
        "Logout: Token revocation failed, but proceeding with success",
      );
    }

    respondWithJSON(res, 204, null);
  },
);

// update user
export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const token = getBearerToken(req);
    const userID = validateJWT(token, apiConfig.jwtSecret);

    const { email, username, password } = req.body;

    if (!email || typeof email !== "string") {
      respondWithError(res, 400, "email is required");
      return;
    }
    if (!username || typeof username !== "string") {
      respondWithError(res, 400, "username is required");
      return;
    }
    if (!password || typeof password !== "string") {
      respondWithError(res, 400, "password is required");
      return;
    }

    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUsers(
      email,
      username,
      hashedPassword,
      userID,
    );

    if (!updatedUser) {
      respondWithError(res, 404, "user not found");
      return;
    }

    respondWithJSON(res, 200, {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  },
);

// refresh token
export const refreshHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshTokenStr = getBearerToken(req);
    const userID = await getUserFromRefreshToken(refreshTokenStr);

    if (!userID) {
      respondWithError(res, 401, "invalid refresh token");
      return;
    }

    const newAccessToken = makeJWT(userID, 3600, apiConfig.jwtSecret);
    respondWithJSON(res, 200, { token: newAccessToken });
  },
);

// revoke
export const revokeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshTokenStr = getBearerToken(req);
    await revokeRefreshToken(refreshTokenStr);

    respondWithJSON(res, 204, null);
  },
);
