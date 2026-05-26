import { db } from "../index.js";
import { deliveryAttempts, jobs } from "../schema.js";
import { eq } from "drizzle-orm";

export class DeliveryService {
  async deliverToSubscriber(
    jobId: string,
    subscriber: any,
    payload: any,
    attemptNumber: number = 1,
  ) {
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
}

export const deliveryService = new DeliveryService();
