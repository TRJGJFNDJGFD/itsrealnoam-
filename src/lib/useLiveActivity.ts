import { useEffect, useRef, useState } from "react";
import type { ActivityEvent } from "../data/types";
import { fetchActivity } from "../data/api";
import { EXTRA_ACTIVITY_POOL } from "../data/mockActivity";

const MAX_EVENTS = 12;

// Loads the initial feed, then simulates new events arriving every
// 8-15s by drawing from a rotating mock pool — there is no real event
// stream behind this yet (see src/data/api.ts).
export function useLiveActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [newestId, setNewestId] = useState<string | null>(null);
  const poolIndex = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number;

    fetchActivity().then((initial) => {
      if (cancelled) return;
      setEvents(initial);
      scheduleNext();
    });

    function scheduleNext() {
      const delay = 8000 + Math.random() * 7000;
      timeoutId = window.setTimeout(() => {
        const template = EXTRA_ACTIVITY_POOL[poolIndex.current % EXTRA_ACTIVITY_POOL.length];
        poolIndex.current += 1;
        const event: ActivityEvent = {
          ...template,
          id: `sim-${Date.now()}-${poolIndex.current}`,
          timestamp: Date.now(),
        };
        setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
        setNewestId(event.id);
        scheduleNext();
      }, delay);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return { events, newestId };
}
