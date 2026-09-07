import { useEffect, useState } from "react";
import type { NetworkHistoryPoint, NetworkHistoryRange } from "../data/types";
import { fetchHistory } from "../data/api";

export function useNetworkHistory(range: NetworkHistoryRange) {
  const [points, setPoints] = useState<NetworkHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchHistory(range).then((data) => {
      if (!cancelled) {
        setPoints(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [range]);

  return { points, loading };
}
