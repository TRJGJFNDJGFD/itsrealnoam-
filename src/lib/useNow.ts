import { useEffect, useState } from "react";

// Ticks a re-render every intervalMs so relative-time labels ("12 seconds
// ago", "Last updated: just now") stay accurate without each caller
// running its own interval.
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
