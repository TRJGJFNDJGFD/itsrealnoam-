import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name} (see .env.example)`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  statusApiToken: required("STATUS_API_TOKEN"),
  websiteOrigins: (process.env.WEBSITE_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  staleAfterMs: Number(process.env.STALE_AFTER_MS ?? 15_000),
};
