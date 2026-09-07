import { AnimatePresence, motion } from "framer-motion";
import { SITE_CONFIG } from "../config/site";
import { useNetworkStatus } from "../lib/useNetworkStatus";
import { isStatusApiConfigured } from "../lib/statusApi";
import AnimatedNumber from "./AnimatedNumber";

export default function ServerStatus({ className = "" }: { className?: string }) {
  const { data, reachable, lastFetchedAt } = useNetworkStatus();
  const apiConfigured = isStatusApiConfigured();

  const live = apiConfigured && reachable && lastFetchedAt !== null;
  const online = live && data?.status === "online";
  const totalPlayers = online ? (data?.totalPlayers ?? 0) : 0;
  const totalMaxPlayers = online ? data!.servers.reduce((sum, s) => sum + s.maxPlayers, 0) : 0;

  const statusLabel = !live ? "CHECKING…" : online ? "ONLINE" : "OFFLINE";
  const dotColor = online ? "bg-accent" : "bg-text-muted";
  const labelColor = online ? "text-accent" : "text-text-muted";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        {online && (
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
      <span className="text-text-muted">{SITE_CONFIG.version}</span>
      <AnimatePresence initial={false}>
        {online && totalMaxPlayers > 0 && (
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
              <AnimatedNumber value={totalPlayers} />/{totalMaxPlayers} PLAYERS
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
