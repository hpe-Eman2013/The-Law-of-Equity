export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

/** Supports either:
 *  - GOOGLE_SERVICE_ACCOUNT_JSON (one-line JSON)
 *  - GOOGLE_SERVICE_ACCOUNT_B64 (base64 of the full JSON)
 */
export function getServiceAccountJSON(): string {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  return requireEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
}
