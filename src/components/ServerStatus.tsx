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
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
      </span>
      <span className={labelColor}>{statusLabel}</span>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{SITE_CONFIG.ip}</span>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{version}</span>
      {live && online && (
        <>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">
            {players}/{maxPlayers} PLAYERS
          </span>
        </>
      )}
    </div>
  );
}
