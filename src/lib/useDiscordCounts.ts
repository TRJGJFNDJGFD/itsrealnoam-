import { useEffect, useState } from "react";
import { SITE_CONFIG } from "../config/site";

type DiscordCounts = {
  memberCount: number | null;
  onlineCount: number | null;
};

// Discord's public invite endpoint (with_counts=true) returns approximate
// member/presence counts for any invite without needing the server's
// widget setting enabled or a bot token — safe to call from the browser.
export function useDiscordCounts() {
  const [counts, setCounts] = useState<DiscordCounts>({ memberCount: null, onlineCount: null });

  useEffect(() => {
    let cancelled = false;
    const code = SITE_CONFIG.discord.split("/").pop();

    async function fetchCounts() {
      try {
        const res = await fetch(
          `https://discord.com/api/v10/invites/${code}?with_counts=true`
        );
        if (!res.ok) throw new Error("discord invite request failed");
        const data = await res.json();
        if (cancelled) return;
        setCounts({
          memberCount: data.approximate_member_count ?? null,
          onlineCount: data.approximate_presence_count ?? null,
        });
      } catch {
        // invite expired, rate-limited, or offline — the widget just
        // hides the live counts and shows the plain Discord CTA instead
      }
    }

    fetchCounts();
    const interval = window.setInterval(fetchCounts, 5 * 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return counts;
}
