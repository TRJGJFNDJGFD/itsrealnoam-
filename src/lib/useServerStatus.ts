import { useEffect, useState } from "react";
import { SITE_CONFIG, serverStatus as staticFallback, type ServerStatusData } from "../config/site";

// mcsrvstat.us needs no API key and returns CORS-friendly JSON, so it's
// safe to call directly from the browser. We start from the static
// fallback in site.ts and swap in live numbers once the fetch resolves —
// the UI never shows a loading flicker or a broken state.
export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatusData>(staticFallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SITE_CONFIG.ip}`);
        if (!res.ok) throw new Error("mcsrvstat request failed");
        const data = await res.json();
        if (cancelled) return;

        setStatus({
          online: Boolean(data.online),
          players: data.players?.online ?? 0,
          maxPlayers: data.players?.max ?? staticFallback.maxPlayers,
          version: data.version ?? staticFallback.version,
        });
        setLive(true);
      } catch {
        // network hiccup or the server is briefly unreachable — keep
        // showing the last known (or static) status instead of an error
      }
    }

    fetchStatus();
    const interval = window.setInterval(fetchStatus, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return { status, live };
}
