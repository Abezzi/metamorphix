import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  text,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text().unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 255 })
    .notNull()
    .default("unset"),
  authority: text()
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  apiKey: text("api_key").notNull().unique(),
});

export const sourceURL = pgTable("source_url", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  sourceUrl: text("source_url").unique().notNull(),
  actionType: text("action_type").notNull(), // e.g. 'transform', 'filter', 'enrich', 'webhook-forward'
  actionConfig: jsonb("action_config").notNull().default("{}"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id").references(() => pipelines.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  method: text("method").default("POST"),
  headers: jsonb("headers").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pipelinesRelations = relations(pipelines, ({ one, many }) => ({
  users: one(users, {
    fields: [pipelines.userId],
    references: [users.id],
  }),
  subscribers: many(subscribers),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  pipeline: one(pipelines, {
    fields: [subscribers.pipelineId],
    references: [pipelines.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  pipelines: many(pipelines),
}));

export type SourceURL = typeof sourceURL.$inferSelect;
export type User = typeof users.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;

export type NewSourceURL = typeof sourceURL.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
