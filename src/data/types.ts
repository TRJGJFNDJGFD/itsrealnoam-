// Shared shapes for the /status network dashboard. These are written to
// match what a real Minecraft network API would plausibly return (see
// src/data/api.ts for exactly where a real fetch would replace mock data),
// so swapping the data source later shouldn't require changing these types.

export type ServerStatusKind = "online" | "starting" | "maintenance" | "offline";

export type MinecraftServer = {
  id: string;
  name: string;
  status: ServerStatusKind;
  players: number;
  maxPlayers: number;
  tps: number;
  mspt: number;
  ping: number;
  cpuPercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  uptime: string;
  version: string;
};

export type Player = {
  id: string;
  username: string;
  rank: string;
  serverId: string;
};

export type ActivityEventKind = "join" | "leave" | "kill" | "achievement";

export type ActivityEvent = {
  id: string;
  kind: ActivityEventKind;
  message: string;
  timestamp: number;
};

export type NetworkHistoryPoint = {
  timestamp: number;
  players: number;
};

export type NetworkHistoryRange = "24h" | "7d" | "30d";

export type NetworkStats = {
  playersOnline: number;
  serversOnline: number;
  serversTotal: number;
  averageTps: number;
  averagePing: number;
  uptimePercent: number;
};

export type UptimeSlot = {
  hoursAgo: number;
  status: "up" | "down";
  outageDurationMinutes?: number;
};
