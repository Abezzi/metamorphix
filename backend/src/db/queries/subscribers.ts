import { and, asc, count, desc, eq, exists, like, or } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines, subscribers } from "../schema.js";

type Params = {
  page: number;
  limit: number;
  offset: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
  filterData?: any;
};

export class SubscriberService {
  async getAll() {
    return db.query.subscribers.findMany({
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
  }

  async getAllSubscribers(params: Params & { userId: string }) {
    const { page, limit, offset, sort, order, search, filterData, userId } =
      params;

    // build where conditions
    const whereConditions: any[] = [
      eq(pipelines.userId, userId),
      eq(subscribers.pipelineId, pipelines.id),
    ];

    if (search) {
      whereConditions.push(
        or(
          like(subscribers.url, `%${search}%`),
          like(subscribers.method, `%${search}%`),
        ),
      );
    }

    if (filterData?.method !== undefined) {
      whereConditions.push(eq(subscribers.method, filterData.method));
    }

    const whereClause = and(...whereConditions);

    const validSortFields = [
      "pipelineId",
      "url",
      "method",
      "headers",
      "createdAt",
    ];

    const finalSort = validSortFields.includes(sort as string)
      ? (sort as keyof typeof subscribers)
      : "createdAt";

    // main query with pagination, sorting and relations
    const data = await db.query.subscribers.findMany({
      where: exists(
        db
          .select({ id: pipelines.id })
          .from(pipelines)
          .where(eq(pipelines.id, subscribers.pipelineId)),
      ),
      with: {
        // returns pipeline data too
        pipeline: true,
      },
      orderBy: [
        order === "asc"
          ? asc(subscribers[finalSort as keyof typeof subscribers] as any)
          : desc(subscribers[finalSort as keyof typeof subscribers] as any),
      ],
      limit,
      offset,
    });

    // total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(subscribers)
      .innerJoin(pipelines, eq(subscribers.pipelineId, pipelines.id))
      .where(whereClause);

    return {
      data,
      total: Number(total),
    };
  }

  async getById(id: string) {
    return db.query.subscribers.findFirst({
      where: eq(subscribers.id, id),
    });
  }
}
