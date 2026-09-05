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
    accent: "#C3524A",
  },
];

export const FEATURES = [
  {
    id: "gameplay",
    title: "Custom Gameplay",
    description: "Unique systems designed to keep every session fresh.",
  },
  {
    id: "competitive",
    title: "Competitive Play",
    description: "Fight, improve and prove yourself.",
  },
  {
    id: "progression",
    title: "Constant Progression",
    description: "Always have something new to unlock and achieve.",
  },
  {
    id: "community",
    title: "Community",
    description: "Play with friends and become part of Legend-IL.",
  },
];
