// Public, read-only endpoint the website's browser code calls directly
// (same origin as the site itself — this function is deployed alongside
// it, so no separate host or CORS story is needed for the site's own
// fetches). WEBSITE_ORIGIN, if set, additionally allows other origins to
// read this endpoint from a browser.
import { get } from "@vercel/blob";
import { HEARTBEAT_BLOB_PATHNAME, type HeartbeatRecord } from "./_lib/types.js";

const STALE_AFTER_MS = Number(process.env.STALE_AFTER_MS ?? 15_000);

// get() is a direct lookup by exact pathname (like S3 GetObject) — unlike
// list(), which scans/indexes blobs and can be eventually consistent, so a
// blob written moments ago may not show up in a list() result yet even
// though a direct get() for its exact pathname already sees it.
async function readLatestHeartbeat(): Promise<HeartbeatRecord | null> {
  const result = await get(HEARTBEAT_BLOB_PATHNAME, { access: "private", useCache: false });
  if (!result) {
    console.log("[status] no blob at pathname", HEARTBEAT_BLOB_PATHNAME);
    return null;
  }
  const text = await new Response(result.stream).text();
  const record = JSON.parse(text) as HeartbeatRecord;
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
