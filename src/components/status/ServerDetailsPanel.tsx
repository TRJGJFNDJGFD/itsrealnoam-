import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { MinecraftServer } from "../../data/types";
import { getStatusVisual } from "./statusVisuals";
import QuickJoinButton from "./QuickJoinButton";

type Props = {
  server: MinecraftServer;
  onClose: () => void;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0">
      <span className="text-xs font-semibold tracking-[0.1em] text-text-muted">{label}</span>
      <span className="font-mono text-sm text-white-pure">{value}</span>
    </div>
  );
}

export default function ServerDetailsPanel({ server, onClose }: Props) {
  const visual = getStatusVisual(server.status);
  const isOnline = server.status === "online";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-4 border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-text-muted">
              {server.name.toUpperCase()}
            </span>
            <div className={`mt-1 flex items-center gap-1.5 text-sm font-semibold ${visual.text}`}>
              <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: visual.dot }} />
              {visual.label}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close server details"
            className="focus-ring text-text-muted transition-colors hover:text-white-pure"
          >
            <X size={18} />
          </button>
        </div>

        {isOnline ? (
          <>
            <p className="mt-4 text-2xl font-semibold text-white-pure">
              {server.players} / {server.maxPlayers} <span className="text-base font-normal text-text-secondary">Players</span>
            </p>

            <div className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
              <Stat label="TPS" value={server.tps.toFixed(2)} />
              <Stat label="MSPT" value={`${server.mspt.toFixed(1)}ms`} />
              <Stat label="PING" value={`${server.ping}ms`} />
              <Stat label="CPU" value={`${server.cpuPercent}%`} />
              <Stat label="RAM" value={`${server.ramUsedGb.toFixed(1)} / ${server.ramTotalGb} GB`} />
              <Stat label="VERSION" value={server.version} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div>
                <span className="block text-xs font-semibold tracking-[0.1em] text-text-muted">UPTIME</span>
                <span className="text-lg font-semibold text-white-pure">{server.uptime}</span>
              </div>
              <QuickJoinButton />
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-text-secondary">
            This server isn't running right now. Check back soon, or ask in Discord if it's expected
            to be down for a while.
          </p>
        )}
      </div>
    </motion.div>
  );
}
