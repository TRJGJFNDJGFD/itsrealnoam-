import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StatusApiServer } from "../../lib/statusApi";
import ServerCard from "./ServerCard";
import ServerDetailsPanel from "./ServerDetailsPanel";

export default function ServerGrid({ servers }: { servers: StatusApiServer[] }) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const selected = servers.find((s) => s.name === selectedName) ?? null;

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
            key={server.name}
            server={server}
            selected={selectedName === server.name}
            onSelect={() => setSelectedName((current) => (current === server.name ? null : server.name))}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && <ServerDetailsPanel server={selected} onClose={() => setSelectedName(null)} />}
      </AnimatePresence>
    </div>
  );
}
