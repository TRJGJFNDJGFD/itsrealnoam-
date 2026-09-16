// Public, read-only endpoint the website's browser code calls directly
// (same origin as the site itself — this function is deployed alongside
// it, so no separate host or CORS story is needed for the site's own
// fetches). WEBSITE_ORIGIN, if set, additionally allows other origins to
// read this endpoint from a browser.
import { Redis } from "@upstash/redis";
import { HEARTBEAT_REDIS_KEY, type HeartbeatRecord } from "./_lib/types.js";

// Kept generous rather than tight to the 3s heartbeat interval: a real
// visitor doesn't care about the exact cutoff, only that a genuine outage
// is still caught within well under a minute.
const STALE_AFTER_MS = Number(process.env.STALE_AFTER_MS ?? 30_000);

export default {
  async fetch(request: Request) {
    // Without an explicit no-store directive, Vercel's edge network can
    // cache this response and keep serving a frozen snapshot to later
    // requests — even ones hitting a different edge location — instead of
    // re-running this function each time.
    const headers: Record<string, string> = {
      "content-type": "application/json",
      "cache-control": "no-store, must-revalidate",
    };

    const origin = request.headers.get("origin");
    const allowedOrigins = (process.env.WEBSITE_ORIGIN ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    if (origin && allowedOrigins.includes(origin)) {
      headers["access-control-allow-origin"] = origin;
    }

    const redis = Redis.fromEnv();
    const record = await redis.get<HeartbeatRecord>(HEARTBEAT_REDIS_KEY);
    const serverNow = Date.now();
    const ageMs = record ? serverNow - record.receivedAt : null;
    const isFresh = record !== null && ageMs !== null && ageMs <= STALE_AFTER_MS;

    // TEMPORARY: exposes the server's own freshness math directly in the
    // response so this can be diagnosed without any client-clock guesswork.
    const _debug = {
      hasRecord: record !== null,
      receivedAt: record?.receivedAt ?? null,
      receivedAtType: typeof record?.receivedAt,
      serverNow,
      ageMs,
      staleAfterMs: STALE_AFTER_MS,
      isFresh,
    };

    if (!record || !isFresh) {
      return new Response(
        JSON.stringify({
          network: record?.payload.network ?? null,
          status: "offline",
          lastUpdated: record ? new Date(record.receivedAt).toISOString() : null,
          totalPlayers: null,
          serversOnline: null,
          serversTotal: null,
          servers: [],
          _debug,
        }),
        { status: 200, headers }
      );
    }

    const serversOnline = record.payload.servers.filter((s) => s.status === "online").length;

    return new Response(
      JSON.stringify({
        network: record.payload.network,
        status: "online",
        lastUpdated: new Date(record.receivedAt).toISOString(),
        totalPlayers: record.payload.totalPlayers,
        serversOnline,
        serversTotal: record.payload.servers.length,
        servers: record.payload.servers,
        _debug,
      }),
      { status: 200, headers }
    );
  },
};
