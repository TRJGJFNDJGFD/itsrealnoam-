export type ServerStatusData = {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
};

export type GameMode = {
  id: "skymines" | "lifesteal";
  name: string;
  displayName: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** Short reasons-to-play shown in the game spotlight blocks. */
  highlights: string[];
  featured?: boolean;
  accent: string;
};

export const SITE_CONFIG = {
  name: "Legend-IL",
  displayName: "LEGEND-IL",
  ip: "legend-il.net",
  discord: "https://discord.gg/FSttWURnWs",
  // TODO: add your minecraft-mp.com (or similar) listing URL, then bring
  // back the VOTE nav item the same way Pixel-IL has it.
  vote: "",
  version: "1.21+",
  description: "A legendary Minecraft experience.",
  accent: "#E8B84F",
  // Only flip this on once Geyser (or similar) is actually running — the
  // Join Guide only shows Bedrock steps when this is true, so we never
  // advertise platform support the server doesn't have yet.
  bedrockSupported: false,
};

// Replace with a live call to your /players API on Velocity if you'd
// rather not depend on mcsrvstat.us — see src/lib/useServerStatus.ts.
export const serverStatus: ServerStatusData = {
  online: true,
  players: 0,
  maxPlayers: 100,
  version: "1.21+",
};

// Confirmed modes so far — more are coming, see ComingSoonCard in
// GamesSection. Add a new entry here (and swap ComingSoonCard for a real
// GameCard) once the next mode is ready.
export const GAMES: GameMode[] = [
  {
    id: "skymines",
    name: "SkyMines",
    displayName: "SKYMINES",
    subtitle: "MINE • UPGRADE • DOMINATE",
    description:
      "Mine your way to the top. Upgrade, progress and become the richest player in the sky.",
    tags: ["ECONOMY", "PROGRESSION", "COMPETITIVE"],
    highlights: ["CUSTOM PROGRESSION", "GEAR UPGRADES", "PLAYER ECONOMY"],
    featured: true,
    accent: "#E8B84F",
  },
  {
    id: "lifesteal",
    name: "Lifesteal",
    displayName: "LIFESTEAL",
    subtitle: "SURVIVE • FIGHT • STEAL",
    description:
      "Fight, survive and steal hearts. Build your power and become the last player standing.",
    tags: ["PVP", "SURVIVAL", "RISK"],
    highlights: ["STEAL HEARTS ON KILL", "FULL-LOOT PVP", "HIGH RISK, HIGH REWARD"],
    accent: "#C3524A",
  },
];

export const FEATURES = [
  {
    id: "gameplay",
    title: "Custom Gameplay",
    description: "SkyMines and Lifesteal aren't vanilla with a coat of paint — each mode has its own economy, progression and rules built around how it's meant to be played.",
  },
  {
    id: "competitive",
    title: "Competitive Play",
    description: "PvP, leaderboards and rivalries that mean something. What you achieve here comes from skill and time played.",
  },
  {
    id: "progression",
    title: "Constant Progression",
    description: "There's always a next upgrade, a next rank or a next fight worth showing up for — something new to chase every time you log in.",
  },
  {
    id: "community",
    title: "Community",
    description: "An active Discord, players to squad up with, and a network that's growing from day one — join early and help shape it.",
  },
];
