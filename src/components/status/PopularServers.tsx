import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { MinecraftServer } from "../../data/types";

export default function PopularServers({ servers }: { servers: MinecraftServer[] }) {
  const ranked = [...servers].sort((a, b) => b.players - a.players);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border bg-surface p-6"
    >
      <h2 className="text-xl text-white-pure">Most Popular Servers</h2>

      <ol className="mt-5 space-y-1">
        {ranked.map((server, i) => (
          <li
            key={server.id}
            className="flex items-center gap-4 border-b border-border py-2.5 last:border-b-0"
          >
            <span className="w-5 shrink-0 font-mono text-sm text-text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white-pure">
              {server.name}
            </span>
            {i === 0 && server.players > 0 && (
              <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold tracking-[0.1em] text-accent">
                <Flame size={12} />
                MOST PLAYED
              </span>
            )}
            <span className="shrink-0 text-sm text-text-secondary">{server.players} Players</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
