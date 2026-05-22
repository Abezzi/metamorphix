import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines, subscribers } from "../schema.js";
import {
  CreatePipelineDto,
  UpdatePipelineDto,
} from "../../types/pipeline.types.js";

export class PipelineService {
  async create(data: CreatePipelineDto, userId: string) {
    const [pipeline] = await db
      .insert(pipelines)
      .values({
        name: data.name,
        sourceUrl: `/webhooks/${crypto.randomUUID()}`,
        actionType: data.actionType,
        actionConfig: data.actionConfig || {},
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
}
