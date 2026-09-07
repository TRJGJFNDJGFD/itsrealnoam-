import { useEffect, useState } from "react";
import type { Player } from "../data/types";
import { fetchPlayers } from "../data/api";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPlayers().then((data) => {
      if (!cancelled) {
        setPlayers(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { players, loading };
}
