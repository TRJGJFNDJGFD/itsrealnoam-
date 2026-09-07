// MOCK DATA — see src/data/api.ts for how this gets replaced by a real
// player list (e.g. a Velocity /players endpoint) later.
import type { Player } from "./types";

export const mockPlayers: Player[] = [
  { id: "p1", username: "Noamshen", rank: "LEGEND", serverId: "survival" },
  { id: "p2", username: "Player123", rank: "MVP+", serverId: "skymines" },
  { id: "p3", username: "SkyBlockKing", rank: "VIP", serverId: "skymines" },
  { id: "p4", username: "Alex", rank: "MVP", serverId: "survival" },
  { id: "p5", username: "Steve", rank: "DEFAULT", serverId: "lobby" },
  { id: "p6", username: "EnderQueen", rank: "MVP+", serverId: "survival" },
  { id: "p7", username: "BlockMiner99", rank: "VIP", serverId: "skymines" },
  { id: "p8", username: "Herobrine_", rank: "LEGEND", serverId: "lobby" },
];
