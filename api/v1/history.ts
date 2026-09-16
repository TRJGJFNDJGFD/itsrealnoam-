// Public, read-only endpoint returning the last 24h of player-count history
// as a JSON array of { t, p } points (t = minute-bucket epoch ms, p = total
// players). Same origin/CORS handling as status.ts.
import { Redis } from "@upstash/redis";
import { HISTORY_REDIS_KEY, HISTORY_WINDOW_MS, type HistoryPoint } from "./_lib/types.js";

export default {
  async fetch(request: Request) {
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
    const since = Date.now() - HISTORY_WINDOW_MS;
    const raw = await redis.zrange<string[]>(HISTORY_REDIS_KEY, since, "+inf", {
      byScore: true,
    });

    const points: HistoryPoint[] = raw
      .map((entry) => {
        try {
          return typeof entry === "string" ? (JSON.parse(entry) as HistoryPoint) : (entry as unknown as HistoryPoint);
        } catch {
          return null;
        }
      })
      .filter((p): p is HistoryPoint => p !== null)
      .sort((a, b) => a.t - b.t);

    return new Response(JSON.stringify({ points }), { status: 200, headers });
  },
};
