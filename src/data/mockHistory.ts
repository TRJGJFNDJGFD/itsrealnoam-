// MOCK DATA — a deterministic (seeded) players-online series so the graph
// looks the same on every load instead of jumping around randomly. Swap
// generateHistory() for a real history endpoint later (see src/data/api.ts).
import type { NetworkHistoryPoint, NetworkHistoryRange } from "./types";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANGE_CONFIG: Record<NetworkHistoryRange, { points: number; stepMs: number; seed: number }> = {
  "24h": { points: 24, stepMs: 60 * 60_000, seed: 11 },
  "7d": { points: 7 * 24, stepMs: 60 * 60_000, seed: 23 },
  "30d": { points: 30, stepMs: 24 * 60 * 60_000, seed: 37 },
};

export function generateHistory(range: NetworkHistoryRange): NetworkHistoryPoint[] {
  const { points, stepMs, seed } = RANGE_CONFIG[range];
  const rand = mulberry32(seed);
  const now = Date.now();
  const base = 45;
  const amplitude = 60;

  const series: NetworkHistoryPoint[] = [];
  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * stepMs;
    // day/night-style wave plus noise, clamped to a believable player count
    const wave = Math.sin((i / points) * Math.PI * 3) * amplitude * 0.5;
    const noise = (rand() - 0.5) * 24;
    const players = Math.max(4, Math.round(base + amplitude * 0.5 + wave + noise));
    series.push({ timestamp, players });
  }
  return series;
}
