import { db } from "../index.js";
import { jobs, pipelines, subscribers } from "../schema.js";
import { eq, sql } from "drizzle-orm";
import { JobService } from "../queries/jobs.js";
import { deliveryService } from "../queries/deliveries.js";

export type ActionResult = {
  success: boolean;
  outputPayload: any;
  error?: string;
};

export class ActionProcessor {
  /**
   * Main entry point - executes the correct action based on actionType
   */
  async execute(pipeline: any, inputPayload: any): Promise<ActionResult> {
    const { actionType, actionConfig } = pipeline;

    try {
      let outputPayload: any;

      switch (actionType) {
        case "transform":
          outputPayload = this.transformData(inputPayload, actionConfig);
          break;

        case "filter":
          outputPayload = this.filterData(inputPayload, actionConfig);
          break;

        case "enrich":
          outputPayload = await this.enrichData(inputPayload, actionConfig);
          break;

        case "summarize":
          outputPayload = this.summarizeData(inputPayload, actionConfig);
          break;

        case "webhook-forward":
          outputPayload = inputPayload; // passthrough
          break;

        default:
          throw new Error(`Unknown actionType: ${actionType}`);
      }

      return {
        success: true,
        outputPayload,
      };
    } catch (error: any) {
      console.error(`Action execution failed for type ${actionType}:`, error);
      return {
        success: false,
        outputPayload: null,
        error: error.message,
      };
    }
  }

  /**
   * Action 1: Transform - Field mapping, renaming, adding/removing fields
   */
  private transformData(payload: any, config: any): any {
    if (!payload || typeof payload !== "object") return payload;

    const { fieldMapping = {}, addFields = {}, removeFields = [] } = config;

    let result = { ...payload };

    // Field mapping / renaming
    Object.entries(fieldMapping).forEach(([oldKey, newKey]) => {
      if (oldKey in result) {
        result[newKey as string] = result[oldKey];
        delete result[oldKey];
      }
    });

    // Add new fields
    Object.entries(addFields).forEach(([key, value]) => {
      result[key] = value;
    });

    // Remove fields
    removeFields.forEach((field: string) => {
      delete result[field];
    });

    // Add metadata
    result.processedAt = new Date().toISOString();
    result.processedBy = "Metamorphix";

    return result;
  }

  /**
   * Action 2: Filter - Keep only items that match conditions
   */
  private filterData(payload: any, config: any): any {
    const { condition = {}, keepIfArray = true } = config;

    if (Array.isArray(payload)) {
      const filtered = payload.filter((item) => {
        if (typeof item !== "object" || item === null) return true;
        return Object.entries(condition).every(
          ([key, value]) => item[key] === value,
        );
      });

      return keepIfArray ? filtered : filtered[0] || null;
    }

    // Single object
    const matches = Object.entries(condition).every(
      ([key, value]) => payload[key] === value,
    );
    return matches ? payload : null;
  }

  /**
   * Action 3: Enrich - Add computed / mock external data
   */
  private async enrichData(payload: any, config: any): Promise<any> {
    const { enrichFields = [] } = config;
    let result = { ...payload };

    for (const field of enrichFields) {
      switch (field) {
        case "sentiment":
          result.sentiment = this.mockSentimentAnalysis(payload);
          break;
        case "timestamp":
          result.enrichedAt = new Date().toISOString();
          break;
        case "id":
          result.enrichedId = `enr_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          break;
        case "userInfo":
          result.userInfo = {
            processedBy: "Metamorphix",
            region: "Maule Region, CL",
            location: "Talca",
          };
          break;
        case "stats":
          result.stats = this.calculateBasicStats(payload);
          break;
      }
    }

    return result;
  }

  /**
   * Action 4: Summarize - Create summary of the data
   */
  private summarizeData(payload: any, config: any): any {
    if (Array.isArray(payload)) {
      return {
        originalCount: payload.length,
        summary: {
          processedAt: new Date().toISOString(),
          itemCount: payload.length,
          hasData: payload.length > 0,
          message: config.message || "Data summarized successfully",
        },
        sample: payload.slice(0, 3),
      };
    }

    return {
      ...payload,
      summary: {
        type: "single_object",
        processedAt: new Date().toISOString(),
      },
    };
  }

  private mockSentimentAnalysis(payload: any): string {
    const text = JSON.stringify(payload).toLowerCase();
    if (
      text.includes("good") ||
      text.includes("great") ||
      text.includes("excellent")
    )
      return "positive";
    if (
      text.includes("bad") ||
      text.includes("terrible") ||
      text.includes("awful")
    )
      return "negative";
    return "neutral";
  }

  private calculateBasicStats(payload: any): any {
    if (Array.isArray(payload) && payload.length > 0) {
      return {
        count: payload.length,
        hasNumericValues: payload.some((item: any) => typeof item === "number"),
      };
    }
    return { count: 1 };
  }
}

// Singleton
export const actionProcessor = new ActionProcessor();

/**
 * Main function called by the Worker
 */
export async function processPipelineJob(jobId: string, pipelineId: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
    with: { pipeline: true },
  });

  if (!job) throw new Error("Job not found");

  try {
    // Execute the action only
    const outputPayload = await actionProcessor.execute(
      job.pipeline,
      job.inputPayload,
    );

    await db
      .update(jobs)
      .set({
        status: "completed",
        outputPayload: outputPayload ?? job.inputPayload,
        completedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));

    console.log(`✅ Job ${jobId} processed successfully`);

    return {
      success: true,
      outputPayload: outputPayload ?? job.inputPayload,
      pipelineId: pipelineId,
    };
  } catch (error: any) {
    await db
      .update(jobs)
      .set({ status: "failed", error: error.message })
      .where(eq(jobs.id, jobId));

    throw error;
  }
}

async function getPipelineWithSubscribers(pipelineId: string) {
  const result = await db
    .select({
      pipeline: pipelines,
      subscriber: subscribers,
    })
    .from(pipelines)
    .leftJoin(
      subscribers,
      sql`${subscribers.id} = ANY(${pipelines.subscribersIds})`,
    )
    .where(eq(pipelines.id, pipelineId));

  if (result.length === 0) return null;

  // Group subscribers
  const pipelineData = result[0].pipeline;
  const uniqueSubscribers = Array.from(
    new Map(
      result
        .filter((row) => row.subscriber !== null)
        .map((row) => [row.subscriber!.id, row.subscriber]),
    ).values(),
  );

  return {
    pipeline: pipelineData,
    subscribers: uniqueSubscribers,
  };
}
