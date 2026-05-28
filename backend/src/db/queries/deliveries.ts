import { db } from "../index.js";
import { deliveryAttempts, jobs, pipelines } from "../schema.js";
import { and, asc, count, desc, eq, inArray, like, or } from "drizzle-orm";

type Params = {
  page: number;
  limit: number;
  offset: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
  filterData?: any;
};

export class DeliveryService {
  async deliverToSubscriber(
    jobId: string,
    subscriber: any,
    payload: any,
    attemptNumber: number = 1,
  ) {
    if (!subscriber || !subscriber.id || !subscriber.url?.trim()) {
      console.error(`[Delivery] ❌ Skipping invalid subscriber:`, subscriber);
      return { success: false, error: "Invalid subscriber" };
      // await this.logDeliveryAttempt({
      //   jobId,
      //   subscriberId: subscriber?.id || null,
      //   attemptNumber,
      //   status: "failed",
      //   error: "Subscriber URL is missing or empty",
      // });
      // return { success: false, error: "Missing URL" };
    }
    const startTime = Date.now();

    try {
      const response = await fetch(subscriber.url, {
        method: subscriber.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...subscriber.headers,
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text().catch(() => "");

      await this.logDeliveryAttempt({
        jobId,
        subscriberId: subscriber.id,
        attemptNumber,
        status: response.ok ? "success" : "failed",
        responseStatus: response.status,
        responseBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseBody}`);
      }

      return { success: true };
    } catch (error: any) {
      await this.logDeliveryAttempt({
        jobId,
        subscriberId: subscriber.id,
        attemptNumber,
        status: "failed",
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  private async logDeliveryAttempt(data: {
    jobId: string;
    subscriberId: string;
    attemptNumber: number;
    status: string;
    responseStatus?: number;
    responseBody?: string;
    error?: string;
  }) {
    await db.insert(deliveryAttempts).values({
      jobId: data.jobId,
      subscriberId: data.subscriberId,
      attemptNumber: data.attemptNumber,
      status: data.status,
      responseStatus: data.responseStatus,
      responseBody: data.responseBody,
      error: data.error,
    });
  }

  async deliverWithRetry(jobId: string, subscribers: any[], payload: any) {
    const results = [];

    const validSubscribers = subscribers.filter(
      (sub): sub is any =>
        sub != null &&
        typeof sub === "object" &&
        Boolean(sub?.id) &&
        Boolean(sub?.url?.trim()),
    );

    console.log(
      `[Delivery] Starting delivery for ${validSubscribers.length}/${subscribers.length} valid subscribers`,
    );

    for (const subscriber of subscribers) {
      let success = false;
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const result = await this.deliverToSubscriber(
          jobId,
          subscriber,
          payload,
          attempt,
        );

        if (result.success) {
          success = true;
          break;
        }

        // Exponential backoff
        if (attempt < maxAttempts) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
          );
        }
      }

      results.push({ subscriberUrl: subscriber.url, success });
    }

    return results;
  }

  async getAllDeliveries(params: Params & { userId: string }) {
    const { page, limit, offset, sort, order, search, filterData, userId } =
      params;

    // build where conditions
    const whereConditions: any[] = [];
    whereConditions.push(
      inArray(
        deliveryAttempts.jobId,
        db
          .select({ id: jobs.id })
          .from(jobs)
          .innerJoin(pipelines, eq(jobs.pipelineId, pipelines.id))
          .where(eq(pipelines.userId, userId)),
      ),
    );

    if (search) {
      whereConditions.push(
        or(
          like(deliveryAttempts.responseBody, `%${search}%`),
          like(deliveryAttempts.responseStatus, `%${search}%`),
          like(deliveryAttempts.error, `%${search}%`),
          like(deliveryAttempts.jobId, `%${search}%`),
          like(deliveryAttempts.subscriberId, `%${search}%`),
          like(deliveryAttempts.status, `%${search}%`),
        ),
      );
    }

    if (filterData?.method !== undefined) {
      whereConditions.push(eq(deliveryAttempts.status, filterData.status));
    }

    const whereClause = and(...whereConditions);

    const validSortFields = [
      "jobId",
      "subscriberId",
      "attemptNumber",
      "status",
      "responseStatus",
      "responseBody",
      "error",
      "attemptedAt",
    ];

    const finalSort = validSortFields.includes(sort as string)
      ? (sort as keyof typeof deliveryAttempts)
      : "attemptedAt";

    // main query with pagination, sorting and relations
    const data = await db.query.deliveryAttempts.findMany({
      where: whereClause,
      with: {
        job: {
          with: {
            pipeline: true,
          },
        },
        subscriber: true,
      },
      orderBy: [
        order === "asc"
          ? asc(
            deliveryAttempts[
            finalSort as keyof typeof deliveryAttempts
            ] as any,
          )
          : desc(
            deliveryAttempts[
            finalSort as keyof typeof deliveryAttempts
            ] as any,
          ),
      ],
      limit,
      offset,
    });

    // total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(deliveryAttempts)
      .where(whereClause);

    return {
      data,
      total: Number(total),
    };
  }

  async getById(id: string) {
    return db.query.deliveryAttempts.findFirst({
      where: eq(deliveryAttempts.id, id),
    });
  }
}

export const deliveryService = new DeliveryService();
