export type ServerStatusData = {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
};

export const SITE_CONFIG = {
  name: "Legend-IL",
  displayName: "LEGEND-IL",
  ip: "legend-il.net",
  discord: "https://discord.gg/BMQkSdBXHG",
  vote: "https://minecraft-mp.com/server-s359787",
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

export const FEATURES = [
  {
    id: "gameplay",
    title: "Custom Gameplay",
    description: "Not vanilla with a coat of paint — custom systems, economy and rules built around how the server is meant to be played.",
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
