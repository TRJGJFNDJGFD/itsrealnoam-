import { useEffect, useState } from "react";
import type { UptimeSlot } from "../data/types";
import { fetchUptime } from "../data/api";

export function useUptime() {
  const [percent, setPercent] = useState(0);
  const [timeline, setTimeline] = useState<UptimeSlot[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchUptime().then((data) => {
      if (cancelled) return;
      setPercent(data.percent);
      setTimeline(data.timeline);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { percent, timeline };
}
