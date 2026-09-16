// Velocity-only endpoint. Requires "Authorization: Bearer <STATUS_API_TOKEN>".
// Stores the latest heartbeat in Vercel's Runtime Cache — a built-in cache
// for Vercel Functions, so no separate database needs provisioning. It's
// a cache (entries can be evicted early), which is fine here: the staleness
// check in status.ts already treats "no recent heartbeat" as offline, so an
// evicted entry just looks like a normal stale/offline period.
import { getCache } from "@vercel/functions";
import { validateHeartbeat } from "./_lib/validate.js";
import { HEARTBEAT_CACHE_KEY, type HeartbeatRecord } from "./_lib/types.js";

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
    const staleAfterMs = Number(process.env.STALE_AFTER_MS ?? 15_000);

    const cache = getCache();
    await cache.set(HEARTBEAT_CACHE_KEY, record, {
      // A little longer than the staleness window itself, so the cache
      // never expires an entry status.ts would still consider fresh.
      ttl: Math.ceil(staleAfterMs / 1000) + 10,
    });

    return json({ success: true }, 200);
  },
};
