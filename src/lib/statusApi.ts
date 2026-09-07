// Thin client for the status API, which is just Netlify Functions deployed
// as part of this same site (see /netlify/functions) — no separate host,
// no API URL to configure. The functions read/write a Netlify Blobs store
// instead of in-memory state, and are only ever reached over HTTPS by this
// same-origin fetch; the Velocity plugin's API token is never present here.

export type StatusApiServer = {
  name: string;
  status: "online" | "offline";
  players: number;
  maxPlayers: number;
};

export type StatusApiResponse = {
  network: string | null;
  status: "online" | "offline";
  lastUpdated: string | null;
  totalPlayers: number | null;
  serversOnline: number | null;
  serversTotal: number | null;
  servers: StatusApiServer[];
};

// The API always lives at /api/v1/* on this same site, so there's nothing
// to configure — kept as a function so the poller has a single place to
// gate on if that ever changes.
export function isStatusApiConfigured(): boolean {
  return true;
}

export async function fetchNetworkStatus(): Promise<StatusApiResponse> {
  const res = await fetch("/api/v1/status");
  if (!res.ok) {
    throw new Error(`Status API responded with ${res.status}`);
  }
  return (await res.json()) as StatusApiResponse;
}
