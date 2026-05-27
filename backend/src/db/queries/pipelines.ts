import { and, asc, count, desc, eq, gte, like, lt, or } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines, subscribers } from "../schema.js";
import {
  CreatePipelineDto,
  UpdatePipelineDto,
} from "../../types/pipeline.types.js";

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

type PipelineStatistic = {
  totalPipelines: Statistic;
  activePipelines: Statistic;
  newPipelines: Statistic;
};

export class PipelineService {
  async create(data: CreatePipelineDto, userId: string) {
    const [pipeline] = await db
      .insert(pipelines)
      .values({
        name: data.name,
        description: data.description,
        sourceUrl: crypto.randomUUID(),
        actionType: data.actionType,
        actionConfig: data.actionConfig || {},
        isActive: data.isActive || false,
        userId,
      })
      .returning();

    if (data.subscribers && data.subscribers.length > 0) {
      await db.insert(subscribers).values(
        data.subscribers.map((sub) => ({
          pipelineId: pipeline.id,
          url: sub.url,
          method: sub.method || "POST",
          headers: sub.headers || {},
        })),
      );
    }

    return this.getById(pipeline.id);
  }

  async getAll() {
    return db.query.pipelines.findMany({
      with: { subscribers: true },
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
  }

  async getAllPipelines(params: Params & { userId: string }) {
    const { page, limit, offset, sort, order, search, filterData, userId } =
      params;

    // build where conditions
    const whereConditions: any[] = [eq(pipelines.userId, userId)];

    if (search) {
      whereConditions.push(
        or(
          like(pipelines.name, `%${search}%`),
          like(pipelines.sourceUrl, `%${search}%`),
          like(pipelines.actionType, `%${search}%`),
        ),
      );
    }

    // filters
    if (filterData?.isActive !== undefined) {
      whereConditions.push(eq(pipelines.isActive, filterData.isActive));
    }
    if (filterData?.actionType) {
      whereConditions.push(eq(pipelines.actionType, filterData.actionType));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const validSortFields = [
      "name",
      "createdAt",
      "updatedAt",
      "isActive",
      "actionType",
      "sourceUrl",
    ];
    const finalSort = validSortFields.includes(sort as string)
      ? sort
      : "createdAt";

    // main query with pagination, sorting and relations
    const data = await db.query.pipelines.findMany({
      where: whereClause,
      with: { subscribers: true },
      orderBy: [
        order === "asc"
          ? asc(pipelines[finalSort as keyof typeof pipelines] as any)
          : desc(pipelines[finalSort as keyof typeof pipelines] as any),
      ],
      limit,
      offset,
    });

    // total count for pagination
    const [{ total }] = await db
      .select({ total: count() })
      .from(pipelines)
      .where(whereClause);

    return {
      data,
      total: Number(total),
    };
  }

  async getById(id: string) {
    return db.query.pipelines.findFirst({
      where: eq(pipelines.id, id),
      with: { subscribers: true },
    });
  }

  async update(id: string, data: UpdatePipelineDto) {
    await db
      .update(pipelines)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pipelines.id, id));

    return this.getById(id);
  }

  async delete(id: string) {
    await db.delete(pipelines).where(eq(pipelines.id, id));
  }

  async getBySourceUrl(sourceUrl: string) {
    return db.query.pipelines.findFirst({
      where: eq(pipelines.sourceUrl, sourceUrl),
      with: { subscribers: true },
    });
  }

  async getPipelinesStatistic(userId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // condition to get pipelines made by the user
    const userCondition = eq(pipelines.userId, userId);

    // total pipelines
    const totalResult = await db
      .select({ count: count() })
      .from(pipelines)
      .where(userCondition);
    const totalPipelines = Number(totalResult[0]?.count || 0);

    // active pipelines
    const activeResult = await db
      .select({ count: count() })
      .from(pipelines)
      .where(and(userCondition, eq(pipelines.isActive, true)));

    const activePipelines = Number(activeResult[0]?.count || 0);

    // new pipelines (last 30 days)
    const newResult = await db
      .select({ count: count() })
      .from(pipelines)
      .where(and(userCondition, gte(pipelines.createdAt, thirtyDaysAgo)));

    const newPipelines = Number(newResult[0]?.count || 0);

    // growth calculation for new pipelines
    const previousPeriodStart = new Date(
      now.getTime() - 60 * 24 * 60 * 60 * 1000,
    );

    const previousResult = await db
      .select({ count: count() })
      .from(pipelines)
      .where(
        and(
          gte(pipelines.createdAt, previousPeriodStart),
          lt(pipelines.createdAt, thirtyDaysAgo),
        ),
      );

    const previousNew = Number(previousResult[0]?.count || 0);

    const newGrowShrink =
      previousNew === 0
        ? newPipelines > 0
          ? 100
          : 0
        : Math.round(((newPipelines - previousNew) / previousNew) * 100);

    return {
      totalPipelines: {
        value: totalPipelines,
        growShrink: 0,
      },
      activePipelines: {
        value: activePipelines,
        growShrink: 0,
      },
      newPipelines: {
        value: newPipelines,
        growShrink: newGrowShrink,
      },
    } as PipelineStatistic;
  }
}
