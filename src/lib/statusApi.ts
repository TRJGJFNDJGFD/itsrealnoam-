// Thin client for the Legend-IL Status API (see /legendil-status-api).
// VITE_STATUS_API_URL is a public base URL, not a secret — the API token
// lives only on the Velocity plugin and is never present in this bundle.

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

export function isStatusApiConfigured(): boolean {
  return Boolean(import.meta.env.VITE_STATUS_API_URL);
}

export async function fetchNetworkStatus(): Promise<StatusApiResponse> {
  const baseUrl = import.meta.env.VITE_STATUS_API_URL as string | undefined;
  if (!baseUrl) {
    throw new Error("VITE_STATUS_API_URL is not configured — see .env.example");
  }

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/status`);
  if (!res.ok) {
    throw new Error(`Status API responded with ${res.status}`);
  }
  return (await res.json()) as StatusApiResponse;
}
