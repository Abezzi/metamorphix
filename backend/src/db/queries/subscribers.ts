import { and, asc, count, desc, eq, exists, like, or } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines, subscribers } from "../schema.js";
import {
  CreateSubscriberDto,
  UpdateSubscriberDto,
} from "../../types/subscriber.types.js";

type Params = {
  page: number;
  limit: number;
  offset: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
  filterData?: any;
};

type Statistic = {
  value: number;
  growShrink: number;
};

type SubscriberStatistic = {
  totalPipelines: Statistic;
  activePipelines: Statistic;
  newPipelines: Statistic;
};

export class SubscriberService {
  async create(data: CreateSubscriberDto, userId: string) {
    const [subscriber] = await db
      .insert(subscribers)
      .values({
        url: data.url,
        method: data.method,
        headers: data.headers || {},
        userId,
      })
      .returning();

    return this.getById(subscriber.id);
  }
  async getAll() {
    return db.query.subscribers.findMany({
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
  }

  async getAllSubscribers(params: Params & { userId: string }) {
    const { page, limit, offset, sort, order, search, filterData, userId } =
      params;

    // build where conditions
    const whereConditions: any[] = [eq(subscribers.userId, userId)];

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
      where: whereClause,
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

  async update(id: string, data: UpdateSubscriberDto) {
    await db
      .update(subscribers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscribers.id, id));

    return this.getById(id);
  }

  async delete(id: string) {
    await db.delete(subscribers).where(eq(subscribers.id, id));
  }
}
