// MOCK DATA — a static 24-hour uptime timeline for demonstration.
import type { UptimeSlot } from "./types";

export const mockUptimeTimeline: UptimeSlot[] = Array.from({ length: 24 }, (_, i) => {
  const hoursAgo = 23 - i;
  // A single short outage 9 hours ago, everything else healthy.
  if (hoursAgo === 9) {
    return { hoursAgo, status: "down", outageDurationMinutes: 5 };
  }
  return { hoursAgo, status: "up" };
});

export const mockUptimePercent = 99.98;
