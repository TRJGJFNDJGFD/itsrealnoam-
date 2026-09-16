// Public, read-only endpoint the website's browser code calls directly
// (same origin as the site itself — this function is deployed alongside
// it, so no separate host or CORS story is needed for the site's own
// fetches). WEBSITE_ORIGIN, if set, additionally allows other origins to
// read this endpoint from a browser.
import { Redis } from "@upstash/redis";
import { HEARTBEAT_REDIS_KEY, type HeartbeatRecord } from "./_lib/types.js";

// Guards against an empty-string env var too, not just an unset one:
// `Number(process.env.STALE_AFTER_MS ?? 15000)` would silently become 0
// (and mark every heartbeat instantly stale) if the variable exists in
// Vercel's dashboard but was left blank — `??` only falls back on
// null/undefined, not on "".
function parseStaleAfterMs(): number {
  const raw = process.env.STALE_AFTER_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15_000;
}
const STALE_AFTER_MS = parseStaleAfterMs();

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
    const isFresh = record !== null && Date.now() - record.receivedAt <= STALE_AFTER_MS;

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
      }),
      { status: 200, headers }
    );
  },
};
