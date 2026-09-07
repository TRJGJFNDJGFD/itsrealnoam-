// ---------------------------------------------------------------------------
// Data layer for the /status network dashboard.
//
//   UI (components/status/*, pages/Status.tsx)
//     -> this file (networkApi)
//       -> [currently] mock data below
//       -> [future]    a real Minecraft network API
//
// Every function here is already async and returns the same shape a real
// backend would. To go live, replace a function body with a `fetch()` call
// to your own API (which in turn talks to your Minecraft network — e.g. a
// Velocity/BungeeCord plugin exposing REST or a WebSocket, or a service
// polling the servers via RCON/query and caching results). Nothing in
// src/components/status or src/pages/Status.tsx needs to change — they only
// ever import from this file.
//
// Suggested real endpoints (adjust to whatever you actually build):
//   GET /api/network/servers   -> MinecraftServer[]
//   GET /api/network/players   -> Player[]
//   GET /api/network/activity  -> ActivityEvent[]   (or a WebSocket stream)
//   GET /api/network/history?range=24h|7d|30d -> NetworkHistoryPoint[]
//
// IMPORTANT: none of this is live right now. There is no backend behind
// Legend-IL's network dashboard yet — every function below resolves mock
// data from src/data/mock*.ts. The UI is allowed to say "Live" / "Last
// updated" for presentation, but nothing in this file should ever claim to
// be talking to a real server until it actually is.
// ---------------------------------------------------------------------------

import type {
  ActivityEvent,
  MinecraftServer,
  NetworkHistoryPoint,
  NetworkHistoryRange,
  NetworkStats,
  Player,
  UptimeSlot,
} from "./types";
import { mockServers } from "./mockServers";
import { mockPlayers } from "./mockPlayers";
import { createInitialActivity } from "./mockActivity";
import { generateHistory } from "./mockHistory";
import { mockUptimePercent, mockUptimeTimeline } from "./mockUptime";

export async function fetchServers(): Promise<MinecraftServer[]> {
  return mockServers;
}

export async function fetchPlayers(): Promise<Player[]> {
  return mockPlayers;
}

export async function fetchActivity(): Promise<ActivityEvent[]> {
  return createInitialActivity();
}

export async function fetchHistory(range: NetworkHistoryRange): Promise<NetworkHistoryPoint[]> {
  return generateHistory(range);
}

export async function fetchUptime(): Promise<{ percent: number; timeline: UptimeSlot[] }> {
  return { percent: mockUptimePercent, timeline: mockUptimeTimeline };
}

// Aggregated from fetchServers() so the homepage teaser and the /status
// overview cards can never disagree — both read from this one function.
export async function fetchNetworkStats(): Promise<NetworkStats> {
  const servers = await fetchServers();
  const online = servers.filter((s) => s.status === "online");
  const playersOnline = servers.reduce((sum, s) => sum + s.players, 0);
  const averageTps = online.length
    ? online.reduce((sum, s) => sum + s.tps, 0) / online.length
    : 0;
  const averagePing = online.length
    ? Math.round(online.reduce((sum, s) => sum + s.ping, 0) / online.length)
    : 0;

  return {
    playersOnline,
    serversOnline: online.length,
    serversTotal: servers.length,
    averageTps: Math.round(averageTps * 100) / 100,
    averagePing,
    uptimePercent: mockUptimePercent,
  };
}
