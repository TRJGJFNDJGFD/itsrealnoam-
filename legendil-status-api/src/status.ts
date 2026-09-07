import { config } from "./config.js";
import { getHeartbeatState, type ServerStatusEntry } from "./state.js";

export type StatusResponse = {
  network: string | null;
  status: "online" | "offline";
  lastUpdated: string | null;
  totalPlayers: number | null;
  serversOnline: number | null;
  serversTotal: number | null;
  servers: ServerStatusEntry[];
};

// The single source of truth for "is this data fresh enough to call live".
// Never let a caller display a stale heartbeat as current — if it's older
// than staleAfterMs, the network is reported offline and the numbers are
// withheld rather than served as if they were still accurate.
export function buildStatusResponse(): StatusResponse {
  const { latest, receivedAt } = getHeartbeatState();
  const isFresh = receivedAt !== null && Date.now() - receivedAt <= config.staleAfterMs;

  if (!latest || !isFresh) {
    return {
      network: latest?.network ?? null,
      status: "offline",
      lastUpdated: receivedAt ? new Date(receivedAt).toISOString() : null,
      totalPlayers: null,
      serversOnline: null,
      serversTotal: null,
      servers: [],
    };
  }

  const serversOnline = latest.servers.filter((s) => s.status === "online").length;

  return {
    network: latest.network,
    status: "online",
    lastUpdated: new Date(receivedAt).toISOString(),
    totalPlayers: latest.totalPlayers,
    serversOnline,
    serversTotal: latest.servers.length,
    servers: latest.servers,
  };
}
