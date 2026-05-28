import { db } from "../index.js";
import { jobs, pipelines, subscribers } from "../schema.js";
import { and, asc, count, desc, eq, inArray, like, or } from "drizzle-orm";
import { Queue } from "bullmq";

type Params = {
  page: number;
  limit: number;
  offset: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
  filterData?: any;
};

// Initialize BullMQ queue (we'll configure this properly soon)
const jobQueue = new Queue("pipeline-jobs", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

export class JobService {
  async createQueuedJob(data: { pipelineId: string; inputPayload: any }) {
    const [job] = await db
      .insert(jobs)
      .values({
        pipelineId: data.pipelineId,
        inputPayload: data.inputPayload,
        status: "queued",
      })
      .returning();

    return job;
  }

  async addToQueue(jobId: string, pipelineId: string) {
    await jobQueue.add(
      "process-pipeline",
      {
        jobId,
        pipelineId,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );
  }

  // We'll add more methods later (getById, getByPipeline, etc.)
  async getById(id: string) {
    return db.query.jobs.findFirst({
      where: eq(jobs.id, id),
      with: { deliveryAttempts: true },
    });
  }

  async getPipelineWithSubscribers(pipelineId: string) {
    const result = await db
      .select({
        pipeline: pipelines,
        subscriber: subscribers,
      })
      .from(pipelines)
      .leftJoin(subscribers, inArray(subscribers.id, pipelines.subscribersIds))
      .where(eq(pipelines.id, pipelineId));

    if (result.length === 0) return null;

    const pipeline = result[0].pipeline;

    // group subscribers
    const uniqueSubscribers = Array.from(
      new Map(
        result
          .filter((r) => r.subscriber !== null)
          .map((r) => [r.subscriber!.id, r.subscriber]),
      ).values(),
    );

    return {
      ...pipeline,
      subscribers: uniqueSubscribers,
    };
  }

  async getAllJobs(params: Params & { userId: string }) {
    const { page, limit, offset, sort, order, search, filterData, userId } =
      params;

    // build where conditions
    const whereConditions: any[] = [];

    whereConditions.push(
      inArray(
        jobs.pipelineId,
        db
          .select({ id: pipelines.id })
          .from(pipelines)
          .where(eq(pipelines.userId, userId)),
      ),
    );

    if (search) {
      whereConditions.push(
        or(like(jobs.status, `%${search}%`), like(jobs.error, `%${search}%`)),
      );
    }

    if (filterData?.status) {
      let statusValues: string[] = [];

      if (Array.isArray(filterData.status)) {
        statusValues = filterData.status;
      } else if (typeof filterData.status === "string") {
        statusValues = [filterData.status];
      } else if (typeof filterData.status === "object") {
        // handle query string array format like filterData[status][0], filterData[status][1]
        statusValues = Object.values(filterData.status).filter(
          (v): v is string => typeof v === "string" && v.length > 0,
        );
      }

      if (statusValues.length > 0) {
        whereConditions.push(inArray(jobs.status, statusValues));
      }
    }

    const whereClause = and(...whereConditions);

    const validSortFields = [
      "status",
      "inputPayload",
      "outputPayload",
      "error",
      "startedAt",
      "createdAt",
      "completedAt",
    ];

    const finalSort = validSortFields.includes(sort as string)
      ? (sort as keyof typeof jobs)
      : "createdAt";

    // main query with pagination, sorting and relations
    const data = await db.query.jobs.findMany({
      where: whereClause,
      with: {
        pipeline: true,
        deliveryAttempts: true,
      },
      orderBy: [
        order === "asc"
          ? asc(jobs[finalSort as keyof typeof jobs] as any)
          : desc(jobs[finalSort as keyof typeof jobs] as any),
      ],
      limit,
      offset,
    });

    // total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(jobs)
      .where(whereClause);

    return {
      data,
      total: Number(total),
    };
  }
}
