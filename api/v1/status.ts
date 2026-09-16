// Public, read-only endpoint the website's browser code calls directly
// (same origin as the site itself — this function is deployed alongside
// it, so no separate host or CORS story is needed for the site's own
// fetches). WEBSITE_ORIGIN, if set, additionally allows other origins to
// read this endpoint from a browser.
import { list } from "@vercel/blob";
import { HEARTBEAT_BLOB_PATHNAME, type HeartbeatRecord } from "./_lib/types.js";

const STALE_AFTER_MS = Number(process.env.STALE_AFTER_MS ?? 15_000);

// Deliberately bypasses every caching layer we can reach: list() (not a
// cacheable get-by-pathname), then a plain authenticated fetch with a
// cache-busting query param and cache: "no-store" — get()'s useCache:false
// wasn't enough on its own to guarantee a fresh read here.
async function readLatestHeartbeat(): Promise<HeartbeatRecord | null> {
  const { blobs } = await list({ prefix: HEARTBEAT_BLOB_PATHNAME, limit: 1 });
  const blob = blobs[0];
  if (!blob) {
    console.log("[status] no blob at pathname", HEARTBEAT_BLOB_PATHNAME);
    return null;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const res = await fetch(`${blob.url}?_=${Date.now()}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    console.log("[status] blob fetch failed", res.status, blob.url);
    return null;
  }

  const record = (await res.json()) as HeartbeatRecord;
  console.log("[status] read heartbeat", { receivedAt: record.receivedAt, now: Date.now() });
  return record;
}

export default {
  async fetch(request: Request) {
    const headers: Record<string, string> = { "content-type": "application/json" };

    const origin = request.headers.get("origin");
    const allowedOrigins = (process.env.WEBSITE_ORIGIN ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    if (origin && allowedOrigins.includes(origin)) {
      headers["access-control-allow-origin"] = origin;
    }

    const record = await readLatestHeartbeat();
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
