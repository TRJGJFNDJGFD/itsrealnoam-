import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MinecraftServer } from "../../data/types";
import ServerCard from "./ServerCard";
import ServerDetailsPanel from "./ServerDetailsPanel";

export default function ServerGrid({ servers }: { servers: MinecraftServer[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = servers.find((s) => s.id === selectedId) ?? null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-xl text-white-pure">Minecraft Servers</h2>
        <p className="mt-1 text-sm text-text-secondary">Live status of every Legend-IL server.</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {servers.map((server, i) => (
          <ServerCard
            key={server.id}
            server={server}
            selected={selectedId === server.id}
            onSelect={() => setSelectedId((current) => (current === server.id ? null : server.id))}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && <ServerDetailsPanel server={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  );
}
