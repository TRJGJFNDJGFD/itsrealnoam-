import { AnimatePresence, motion } from "framer-motion";
import { SITE_CONFIG } from "../config/site";
import { useServerStatus } from "../lib/useServerStatus";

export default function ServerStatus({ className = "" }: { className?: string }) {
  const { status, live } = useServerStatus();
  const { online, players, maxPlayers, version } = status;

  // Before the live fetch resolves we don't know the real player count yet —
  // showing a stale "0/100" would read as an empty server, so the count slot
  // stays reserved (no layout shift) but shows a neutral placeholder instead.
  const statusLabel = !live ? "CHECKING…" : online ? "ONLINE" : "OFFLINE";
  const dotColor = live && online ? "bg-accent" : "bg-text-muted";
  const labelColor = live && online ? "text-accent" : "text-text-muted";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        {live && online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        )}
        <motion.span
          layout
          animate={{ scale: live ? 1 : 0.85 }}
          transition={{ duration: 0.3 }}
          className={`relative inline-flex h-2 w-2 rounded-full transition-colors duration-500 ${dotColor}`}
        />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={statusLabel}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25 }}
          className={labelColor}
        >
          {statusLabel}
        </motion.span>
      </AnimatePresence>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{SITE_CONFIG.ip}</span>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{version}</span>
      <AnimatePresence initial={false}>
        {live && online && (
          <motion.span
            key="players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="text-text-muted">·</span>
            <span className="text-text-muted">
              {players}/{maxPlayers} PLAYERS
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
