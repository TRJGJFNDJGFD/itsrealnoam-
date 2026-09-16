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

export const HEARTBEAT_BLOB_PATHNAME = "legendil-status/latest-heartbeat.json";
