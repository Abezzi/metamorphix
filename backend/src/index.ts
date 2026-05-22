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

const app = express();
const PORT = 8080;

// database migration
const migrationClient = postgres(dbConfig.url, { max: 1 });
await migrate(drizzle(migrationClient), dbConfig.migrationConfig);

// middlewares
// use the middleware handler to log non-ok responses
app.use(express.json());
app.use(loggingMiddleware);

//  routes
const apiRouter = express.Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/pipelines", pipelineRouter);

// mount the main api router
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
