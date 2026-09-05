import { SITE_CONFIG } from "../config/site";
import { useServerStatus } from "../lib/useServerStatus";

export default function ServerStatus({ className = "" }: { className?: string }) {
  const { status } = useServerStatus();
  const { online, players, maxPlayers, version } = status;

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <span className="relative flex h-2 w-2">
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            online ? "bg-accent" : "bg-text-muted"
          }`}
        />
      </span>
      <span className={online ? "text-accent" : "text-text-muted"}>
        {online ? "ONLINE" : "OFFLINE"}
      </span>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{SITE_CONFIG.ip}</span>
      <span className="text-text-muted">·</span>
      <span className="text-text-muted">{version}</span>
      {online && (
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
