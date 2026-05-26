import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  text,
  jsonb,
  boolean,
  integer,
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

// pipelines
export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  sourceUrl: text("source_url").unique().notNull(),
  // e.g. 'transform', 'filter', 'enrich', 'webhook-forward'
  actionType: text("action_type").notNull(),
  actionConfig: jsonb("action_config").notNull().default("{}"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, {
      onDelete: "cascade",
    }),
  url: text("url").notNull(),
  method: text("method").default("POST"),
  headers: jsonb("headers").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
});

// jobs and delivery
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  // queued | processing | completed | failed
  status: text("status").notNull().default("queued"),
  inputPayload: jsonb("input_payload").notNull(),
  outputPayload: jsonb("output_payload"),
  error: text("error"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryAttempts = pgTable("delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => subscribers.id, { onDelete: "cascade" }),
  attemptNumber: integer("attempt_number").notNull().default(1),
  status: text("status").notNull(), // success | failed
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  error: text("error"),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

// relations
export const pipelinesRelations = relations(pipelines, ({ one, many }) => ({
  users: one(users, {
    fields: [pipelines.userId],
    references: [users.id],
  }),
  subscribers: many(subscribers),
  jobs: many(jobs),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  pipeline: one(pipelines, {
    fields: [subscribers.pipelineId],
    references: [pipelines.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  pipeline: one(pipelines, {
    fields: [jobs.pipelineId],
    references: [pipelines.id],
  }),
  deliveryAttempts: many(deliveryAttempts),
}));

export const deliveryAttemptsRelations = relations(
  deliveryAttempts,
  ({ one }) => ({
    job: one(jobs, {
      fields: [deliveryAttempts.jobId],
      references: [jobs.id],
    }),
    subscriber: one(subscribers, {
      fields: [deliveryAttempts.subscriberId],
      references: [subscribers.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  pipelines: many(pipelines),
}));

// types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Pipeline = typeof pipelines.$inferSelect;
export type NewPipeline = typeof pipelines.$inferInsert;

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type DeliveryAttempt = typeof deliveryAttempts.$inferSelect;
export type NewDeliveryAttempt = typeof deliveryAttempts.$inferInsert;

export type SourceURL = typeof sourceURL.$inferSelect;
export type NewSourceURL = typeof sourceURL.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
