import { useState } from "react";
import { motion } from "framer-motion";
import type { UptimeSlot } from "../../data/types";

export default function UptimeTimeline({
  percent,
  timeline,
}: {
  percent: number;
  timeline: UptimeSlot[];
}) {
  const [hovered, setHovered] = useState<UptimeSlot | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border bg-surface p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl text-white-pure">Network Uptime</h2>
        <span className="text-2xl font-semibold text-accent">{percent.toFixed(2)}%</span>
      </div>
      <p className="mt-1 text-sm text-text-secondary">Last 24 hours</p>

      <div className="relative mt-6">
        <div className="flex gap-1">
          {timeline.map((slot) => (
            <button
              key={slot.hoursAgo}
              type="button"
              onMouseEnter={() => setHovered(slot)}
              onMouseLeave={() => setHovered((current) => (current === slot ? null : current))}
              onFocus={() => setHovered(slot)}
              onBlur={() => setHovered((current) => (current === slot ? null : current))}
              aria-label={
                slot.status === "up"
                  ? `${slot.hoursAgo} hours ago: operational`
                  : `${slot.hoursAgo} hours ago: outage, ${slot.outageDurationMinutes} minutes`
              }
              className={`focus-ring h-8 flex-1 rounded-[2px] transition-transform hover:scale-y-110 ${
                slot.status === "up" ? "bg-accent/70" : "bg-[#C3524A]"
              }`}
            />
          ))}
        </div>

        {hovered && (
          <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap border border-border bg-bg-secondary px-3 py-2 text-xs shadow-lg">
            {hovered.status === "up" ? (
              <span className="text-text-secondary">{hovered.hoursAgo}h ago — Operational</span>
            ) : (
              <>
                <span className="block font-semibold text-[#C3524A]">Server outage</span>
                <span className="text-text-muted">Duration: {hovered.outageDurationMinutes} minutes</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between text-[11px] text-text-muted">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </motion.div>
  );
}
