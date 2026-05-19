import { Request, Response, NextFunction } from "express";
import express from "express";
import postgres from "postgres";
import { apiConfig, dbConfig } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { createUser, getUserByEmail, updateUsers } from "./db/queries/users.js";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  validateJWT,
} from "./auth.js";
import {
  createRefreshToken,
  getUserFromRefreshToken,
  revokeRefreshToken,
} from "./db/queries/tokens.js";
import { UserResponse } from "./types/config.js";

const app = express();
const PORT = 8080;

const migrationClient = postgres(dbConfig.url, { max: 1 });
await migrate(drizzle(migrationClient), dbConfig.migrationConfig);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const handlerReadiness = (_req: Request, res: Response) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
};

const handlerCreateUser = async (req: Request, res: Response) => {
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

    const { hashedPassword, ...userResponse } = user;

    if (!user) {
      res.status(400).json({ error: "user already exists" });
      return;
    }

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
};

const handlerLogin = async (req: Request, res: Response) => {
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

    // 1 hour default
    const accessToken = makeJWT(user.id, 3600, apiConfig.jwtSecret);
    const refreshRecord = await createRefreshToken(user.id);

    // return without password
    const userResponse: UserResponse = user;
    const { hashedPassword, ...response } = userResponse;

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

const handlerUpdateUser = async (req: Request, res: Response) => {
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

    // update only the authenticated user
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

const handlerRefresh = async (req: Request, res: Response) => {
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

const handlerRevoke = async (req: Request, res: Response) => {
  try {
    const refreshTokenStr = getBearerToken(req);
    await revokeRefreshToken(refreshTokenStr);
    res.status(204).end();
  } catch (error) {
    res.status(401).json({ error: "invalid refresh token" });
  }
};

// middleware that logs non-ok
const middlewareLogging = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
};

// MIDDLEWARES
// use the middleware handler to log non-ok responses
app.use(middlewareLogging);

//  ENDPOINTS
// create users
app.post("/api/users", handlerCreateUser);
// update user
app.put("/api/users", handlerUpdateUser);
// login
app.post("/api/login", handlerLogin);
// refresh token
app.post("/api/refresh", handlerRefresh);
// revoke the refresh token
app.post("/api/revoke", handlerRevoke);

// check if the server is ready
app.get("/api/healthz", handlerReadiness);
