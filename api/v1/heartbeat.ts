// Velocity-only endpoint. Requires "Authorization: Bearer <STATUS_API_TOKEN>".
// Stores the latest heartbeat in Redis (Upstash, via the Vercel Marketplace
// integration) — a real key-value database, strongly consistent by design.
// Vercel Blob was tried first for this, since it needs no separate
// provisioning step, but its reads proved unreliably stale for a value
// overwritten every few seconds (not what object storage is built for);
// Redis is the right tool for "one value, updated constantly, read by
// everyone" and doesn't have that problem.
import { Redis } from "@upstash/redis";
import { validateHeartbeat } from "./_lib/validate.js";
import { HEARTBEAT_REDIS_KEY, type HeartbeatRecord } from "./_lib/types.js";

function json(body: unknown, status: number): Response {
  return Response.json(body, { status });
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const expectedToken = process.env.STATUS_API_TOKEN;
    if (!expectedToken) {
      return json({ error: "Server misconfigured: STATUS_API_TOKEN is not set" }, 500);
    }

    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
    if (!token || token !== expectedToken) {
      return json({ error: "Unauthorized" }, 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Body must be valid JSON" }, 400);
    }

    const result = validateHeartbeat(body);
    if (!result.ok) {
      return json({ error: result.error }, 400);
    }

    const record: HeartbeatRecord = { payload: result.payload, receivedAt: Date.now() };

    const redis = Redis.fromEnv();
    await redis.set(HEARTBEAT_REDIS_KEY, record);

    return json({ success: true }, 200);
  },
};
