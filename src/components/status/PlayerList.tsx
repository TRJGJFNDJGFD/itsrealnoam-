import { motion } from "framer-motion";
import type { MinecraftServer, Player } from "../../data/types";

const RANK_COLOR: Record<string, string> = {
  LEGEND: "text-accent",
  "MVP+": "text-[#9B7FD4]",
  MVP: "text-[#6FA8DC]",
  VIP: "text-[#6FBF73]",
  DEFAULT: "text-text-muted",
};

function serverName(servers: MinecraftServer[], id: string) {
  return servers.find((s) => s.id === id)?.name ?? id;
}

export default function PlayerList({
  players,
  servers,
}: {
  players: Player[];
  servers: MinecraftServer[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="text-xl text-white-pure">Players Online</h2>
      <p className="mt-1 text-sm text-text-secondary">Who's on the network right now.</p>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/20"
          >
            <img
              src={`https://mc-heads.net/avatar/${encodeURIComponent(player.username)}/32`}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              className="shrink-0 border border-border bg-bg-secondary"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white-pure">{player.username}</p>
              <p className="truncate text-xs text-text-muted">{serverName(servers, player.serverId)}</p>
            </div>
            <span
              className={`shrink-0 text-[11px] font-semibold tracking-[0.1em] ${
                RANK_COLOR[player.rank] ?? "text-text-muted"
              }`}
            >
              {player.rank}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
