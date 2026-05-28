import express from "express";
import postgres from "postgres";
import { dbConfig } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// middlewares
import { loggingMiddleware } from "./middlewares/logging.js";

// import routers
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import pipelineRouter from "./routes/pipeline.js";
import userRouter from "./routes/users.js";
import webhookRouter from "./routes/webhook.js";
import jobsRouter from "./routes/jobs.js";
import subscribersRouter from "./routes/subscriber.js";
import deliveriesRouter from "./routes/deliveries.js";

const app = express();
const PORT = 3000;

// database migration
const runMigration = async () => {
  console.log("🔄 Running database migrations...");
  const migrationClient = postgres(dbConfig.url, { max: 1 });
  try {
    await migrate(drizzle(migrationClient), dbConfig.migrationConfig);
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    // Don't crash the server on migration error in production
  } finally {
    await migrationClient.end();
  }
};

// run migration once at startup
await runMigration();

// middlewares
// use the middleware handler to log non-ok responses
app.use(express.json());
app.use(loggingMiddleware);

//  routes
const apiRouter = express.Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/pipelines", pipelineRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/webhooks", webhookRouter);
apiRouter.use("/jobs", jobsRouter);
apiRouter.use("/subscribers", subscribersRouter);
apiRouter.use("/delivery-attempts", deliveriesRouter);

// mount the main api router
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
