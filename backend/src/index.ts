import { Request, Response, NextFunction } from "express";
import express from "express";
import postgres from "postgres";
import { dbConfig } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

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

// MIDDLEWARES

//  ENDPOINTS

// check if the server is ready
app.get("/api/healthz", handlerReadiness);
