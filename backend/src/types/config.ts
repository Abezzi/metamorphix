import type { MigrationConfig } from "drizzle-orm/migrator";
import { User } from "../db/schema.js";

export type APIConfig = {
  fileserverHits: number;
  platform: string;
  jwtSecret: string;
  polkaKey: string;
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export type UserResponse = Omit<User, "hashed_password">;
