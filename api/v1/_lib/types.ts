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

export type HeartbeatRecord = {
  payload: HeartbeatPayload;
  receivedAt: number;
};

export const HEARTBEAT_REDIS_KEY = "legendil-status:latest-heartbeat";

// One point per minute, kept for 24h — a Redis sorted set scored by the
// minute bucket, so range queries and trimming old points are cheap.
export type HistoryPoint = { t: number; p: number };
export const HISTORY_REDIS_KEY = "legendil-status:history";
export const HISTORY_BUCKET_MS = 60 * 1000;
export const HISTORY_WINDOW_MS = 24 * 60 * 60 * 1000;
