import crypto from "crypto";

export function generateRandomSHA256Hash(): string {
  return crypto
    .createHash("sha256")
    .update(crypto.randomBytes(32))
    .digest("hex");
}
