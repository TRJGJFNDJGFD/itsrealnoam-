// MOCK DATA. The initial feed is timestamped relative to "now" at module
// load so it always reads as freshly happened; useLiveActivity() then
// simulates new events arriving by drawing from EXTRA_ACTIVITY_POOL on an
// interval — see src/lib/useLiveActivity.ts. None of this is pushed by a
// real server; there is no backend behind it yet.
import type { ActivityEvent } from "./types";

const MINUTE = 60_000;

export function createInitialActivity(): ActivityEvent[] {
  const now = Date.now();
  return [
    { id: "a1", kind: "join", message: "Noamshen joined Survival", timestamp: now - 12_000 },
    { id: "a2", kind: "join", message: "Player123 joined SkyMines", timestamp: now - 1 * MINUTE },
    { id: "a3", kind: "kill", message: "Player123 killed Steve", timestamp: now - 4 * MINUTE },
    { id: "a4", kind: "achievement", message: "Alex reached Level 50", timestamp: now - 6 * MINUTE },
    { id: "a5", kind: "leave", message: "Steve left Lobby", timestamp: now - 9 * MINUTE },
  ];
}

// Rotating pool the live-activity simulator draws from to add a "new"
// event every so often, purely for UI demonstration.
export const EXTRA_ACTIVITY_POOL: Omit<ActivityEvent, "id" | "timestamp">[] = [
  { kind: "join", message: "SkyBlockKing joined SkyMines" },
  { kind: "join", message: "EnderQueen joined Survival" },
  { kind: "leave", message: "BlockMiner99 left SkyMines" },
  { kind: "kill", message: "Herobrine_ killed Alex" },
  { kind: "achievement", message: "Noamshen reached Level 30" },
  { kind: "join", message: "Herobrine_ joined Lobby" },
  { kind: "kill", message: "Alex killed Player123" },
  { kind: "achievement", message: "EnderQueen reached Level 75" },
];
