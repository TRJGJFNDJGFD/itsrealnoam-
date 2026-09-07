import { motion } from "framer-motion";
import type { MinecraftServer } from "../../data/types";
import { getStatusVisual } from "./statusVisuals";
import QuickJoinButton from "./QuickJoinButton";

type Props = {
  server: MinecraftServer;
  selected: boolean;
  onSelect: () => void;
  index: number;
};

export default function ServerCard({ server, selected, onSelect, index }: Props) {
  const visual = getStatusVisual(server.status);
  const isOnline = server.status === "online";

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.75 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      aria-expanded={selected}
      className={`focus-ring group w-full cursor-pointer border bg-surface p-6 text-left transition-colors duration-300 hover:bg-surface-light ${
        selected ? visual.border : "border-border hover:border-accent/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white-pure">{server.name}</h3>
          <div className={`mt-1 flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] ${visual.text}`}>
            <span className="relative flex h-1.5 w-1.5">
              {isOnline && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: visual.dot }}
                />
              )}
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: visual.dot }}
              />
            </span>
            {visual.label}
          </div>
        </div>
      </div>

      {isOnline ? (
        <>
          <p className="mt-4 text-sm text-text-secondary">
            {server.players} / {server.maxPlayers} Players
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-muted">
            <span>TPS {server.tps.toFixed(2)}</span>
            <span>Ping {server.ping}ms</span>
            <span>Uptime {server.uptime}</span>
          </div>
          <div className="mt-5" onClick={(e) => e.stopPropagation()}>
            <QuickJoinButton />
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm text-text-muted">Currently unavailable</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="focus-ring mt-5 border border-border px-4 py-2 text-xs font-semibold tracking-wide text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          >
            VIEW DETAILS
          </button>
        </>
      )}
    </motion.div>
  );
}
