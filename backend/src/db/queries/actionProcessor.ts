import { translate } from "@vitalets/google-translate-api";
import { db } from "../index.js";
import { jobs } from "../schema.js";
import { eq } from "drizzle-orm";

export type ActionResult = {
  success: boolean;
  outputPayload: any;
  error?: string;
};

export class ActionProcessor {
  // main entry point - executes the correct action based on actionType
  async execute(pipeline: any, inputPayload: any): Promise<ActionResult> {
    const { actionType, actionConfig } = pipeline;

    try {
      let outputPayload: any;

      switch (actionType) {
        case "transform":
          outputPayload = await this.transformData(inputPayload, actionConfig);
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

  // action 1: transform - field mapping, renaming, adding/removing fields
  private async transformData(payload: any, config: any): Promise<any> {
    if (!payload || typeof payload !== "object") return payload;

    const {
      operation = "map",
      field = "text",
      targetLang = "ar",
      fieldMapping = {},
      addFields = {},
      removeFields = [],
    } = config;

    let result = { ...payload };

    // === TEXT TRANSFORMATIONS ===
    if (operation === "uppercase" || operation === "toUpperCase") {
      result = this.applyTextTransform(result, field, (text: string) =>
        typeof text === "string" ? text.toUpperCase() : text,
      );
    } else if (operation === "lowercase" || operation === "toLowerCase") {
      result = this.applyTextTransform(result, field, (text: string) =>
        typeof text === "string" ? text.toLowerCase() : text,
      );
    } else if (operation === "capitalize") {
      result = this.applyTextTransform(result, field, (text: string) =>
        typeof text === "string"
          ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
          : text,
      );
    } else if (operation === "translate" || operation === "toArabic") {
      result = await this.applyTranslation(result, field, targetLang);
    }

    // field mapping / renaming
    Object.entries(fieldMapping).forEach(([oldKey, newKey]) => {
      if (oldKey in result) {
        result[newKey as string] = result[oldKey];
        delete result[oldKey];
      }
    });

    // add new fields
    Object.entries(addFields).forEach(([key, value]) => {
      result[key] = value;
    });

    // remove fields
    removeFields.forEach((field: string) => {
      delete result[field];
    });

    // add metadata
    result.processedAt = new Date().toISOString();
    result.processedBy = "Metamorphix";

    return result;
  }

  // helper: apply text transformation to a field (supports nested paths later)
  private applyTextTransform(
    payload: any,
    fieldPath: string,
    transformFn: (text: string) => string,
  ): any {
    const result = { ...payload };

    // Simple case: top-level field
    if (fieldPath in result) {
      const value = result[fieldPath];
      if (typeof value === "string") {
        result[fieldPath] = transformFn(value);
      } else if (typeof value === "object" && value !== null) {
        // If it's an object, try to transform common text fields inside
        Object.keys(value).forEach((key) => {
          if (typeof value[key] === "string") {
            value[key] = transformFn(value[key]);
          }
        });
      }
    }

    return result;
  }

  private async applyTranslation(
    payload: any,
    fieldPath: string,
    targetLang: string,
  ): Promise<any> {
    const result = { ...payload };

    if (fieldPath in result && typeof result[fieldPath] === "string") {
      const text = result[fieldPath].trim();
      if (!text) return result;

      try {
        const res = await translate(text, { to: targetLang });

        result[`${fieldPath}_ar`] = res.text;
        result.translatedFrom = "en";
        result.translatedTo = targetLang;

        // Safe way to access nested properties (avoids TS error)
        const fromLang = (res as any).from?.language?.iso || "unknown";
        result.detectedSourceLang = fromLang;

        // Optional: confidence / correction info
        if ((res as any).from?.language?.didYouMean) {
          result.translationNote = "Auto-corrected by Google Translate";
        }
      } catch (err: any) {
        console.error("Translation failed:", err.message);
        result.translationError = err.message;
        result[`${fieldPath}_ar`] = "[Translation failed]";
      }
    }
    return result;
  }

  // action 2: filter - Keep only items that match conditions
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

// singleton
export const actionProcessor = new ActionProcessor();
// main function called by the worker
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
