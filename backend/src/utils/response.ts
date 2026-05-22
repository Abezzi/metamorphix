import type { Response } from "express";

export function respondWithError(
  res: Response,
  code: number,
  message: string,
  logError?: unknown,
) {
  if (logError) {
    console.error(errStringFromError(logError));
  }
  respondWithJSON(res, code, { error: message });
}

export function respondWithJSON(res: Response, code: number, payload: unknown) {
  // code 204: success without content
  if (code === 204) {
    res.status(204).end();
    return;
  }

  if (
    typeof payload !== "object" &&
    typeof payload !== "string" &&
    payload !== null
  ) {
    throw new Error("Payload must be an object, string, or null");
  }

  res.setHeader("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
  // prevent accidental further writes
  res.end();
}

function errStringFromError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) {
    return `${err.message}\n${err.stack || ""}`;
  }
  if (err) return String(err);
  return "An unknown error occurred";
}
