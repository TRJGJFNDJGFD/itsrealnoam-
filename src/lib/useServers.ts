import { useEffect, useState } from "react";
import type { MinecraftServer } from "../data/types";
import { fetchServers } from "../data/api";

export function useServers() {
  const [servers, setServers] = useState<MinecraftServer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchServers().then((data) => {
      if (!cancelled) {
        setServers(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { servers, loading };
}
