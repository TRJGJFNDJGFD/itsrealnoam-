// Public, read-only endpoint the website's browser code calls directly
// (same origin as the site itself, since this function is deployed
// alongside it — no separate host, no separate CORS story needed for the
// site's own fetches). WEBSITE_ORIGIN, if set, additionally allows other
// origins to read this endpoint from a browser.
import { getStore } from "@netlify/blobs";
import type { HeartbeatRecord } from "./lib/types.ts";

const STALE_AFTER_MS = Number(process.env.STALE_AFTER_MS ?? 15_000);

export default async (req: Request) => {
  const headers: Record<string, string> = { "content-type": "application/json" };

  const origin = req.headers.get("origin");
  const allowedOrigins = (process.env.WEBSITE_ORIGIN ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    headers["access-control-allow-origin"] = origin;
  }

  const store = getStore("status");
  const record = (await store.get("latest", { type: "json" })) as HeartbeatRecord | null;

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
};

export const config = { path: "/api/v1/status" };
