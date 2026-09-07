export type ServerStatusEntry = {
  name: string;
  status: "online" | "offline";
  players: number;
  maxPlayers: number;
};

export type HeartbeatPayload = {
  network: string;
  timestamp: string;
  servers: ServerStatusEntry[];
  totalPlayers: number;
};

// Single-process, in-memory. Fine for one API instance; if you ever run
// more than one instance behind a load balancer, replace this with a
// shared store (Redis, etc.) so every instance sees the same heartbeat.
let latest: HeartbeatPayload | null = null;
let receivedAt: number | null = null;

export function recordHeartbeat(payload: HeartbeatPayload): void {
  latest = payload;
  receivedAt = Date.now();
}

export function getHeartbeatState(): { latest: HeartbeatPayload | null; receivedAt: number | null } {
  return { latest, receivedAt };
}
