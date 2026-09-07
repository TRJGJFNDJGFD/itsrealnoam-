import { useEffect, useState } from "react";
import type { NetworkStats } from "../data/types";
import { fetchNetworkStats } from "../data/api";

// Polls the (currently mock) network stats every 30s, mirroring the
// polling pattern used by useServerStatus.ts elsewhere on the site — this
// is what a real integration would keep as-is, just backed by a live
// endpoint instead of aggregated mock data.
export function useNetworkOverview() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchNetworkStats();
      if (cancelled) return;
      setStats(data);
      setLastUpdated(Date.now());
    }

    load();
    const interval = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return { stats, lastUpdated, loading: stats === null };
}
