import type { HeartbeatPayload, ServerStatusEntry } from "./state.js";

type ValidationResult =
  | { ok: true; payload: HeartbeatPayload }
  | { ok: false; error: string };

const MAX_NAME_LENGTH = 64;
const MAX_SERVERS = 100;

export function validateHeartbeat(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.network !== "string" || b.network.length === 0 || b.network.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "network must be a non-empty string" };
  }
  if (typeof b.timestamp !== "string" || Number.isNaN(Date.parse(b.timestamp))) {
    return { ok: false, error: "timestamp must be a valid ISO date string" };
  }
  if (typeof b.totalPlayers !== "number" || !Number.isFinite(b.totalPlayers) || b.totalPlayers < 0) {
    return { ok: false, error: "totalPlayers must be a non-negative number" };
  }
  if (!Array.isArray(b.servers)) {
    return { ok: false, error: "servers must be an array" };
  }
  if (b.servers.length > MAX_SERVERS) {
    return { ok: false, error: "servers array is too large" };
  }

  const servers: ServerStatusEntry[] = [];
  for (const raw of b.servers) {
    if (typeof raw !== "object" || raw === null) {
      return { ok: false, error: "each server entry must be an object" };
    }
    const s = raw as Record<string, unknown>;

    if (typeof s.name !== "string" || s.name.length === 0 || s.name.length > MAX_NAME_LENGTH) {
      return { ok: false, error: "server.name must be a non-empty string" };
    }
    if (s.status !== "online" && s.status !== "offline") {
      return { ok: false, error: "server.status must be 'online' or 'offline'" };
    }
    if (typeof s.players !== "number" || !Number.isFinite(s.players) || s.players < 0) {
      return { ok: false, error: "server.players must be a non-negative number" };
    }
    if (typeof s.maxPlayers !== "number" || !Number.isFinite(s.maxPlayers) || s.maxPlayers < 0) {
      return { ok: false, error: "server.maxPlayers must be a non-negative number" };
    }

    servers.push({
      name: s.name,
      status: s.status,
      players: Math.round(s.players),
      maxPlayers: Math.round(s.maxPlayers),
    });
  }

  return {
    ok: true,
    payload: {
      network: b.network,
      timestamp: b.timestamp,
      servers,
      totalPlayers: Math.round(b.totalPlayers),
    },
  };
}
