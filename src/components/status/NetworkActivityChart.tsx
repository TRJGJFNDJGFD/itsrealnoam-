import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NetworkHistoryRange } from "../../data/types";
import { useNetworkHistory } from "../../lib/useNetworkHistory";

const RANGES: { label: string; value: NetworkHistoryRange }[] = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
];

const W = 800;
const H = 220;
const PAD = 12;

export default function NetworkActivityChart() {
  const [range, setRange] = useState<NetworkHistoryRange>("24h");
  const { points } = useNetworkHistory(range);

  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "", max: 0 };
    const values = points.map((p) => p.players);
    const max = Math.max(...values) * 1.15 || 1;
    const stepX = (W - PAD * 2) / (points.length - 1 || 1);

    const coords = points.map((p, i) => {
      const x = PAD + i * stepX;
      const y = H - PAD - (p.players / max) * (H - PAD * 2);
      return [x, y];
    });

    const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${H - PAD} L${coords[0][0].toFixed(1)},${H - PAD} Z`;

    return { linePath: line, areaPath: area, max };
  }, [points]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border bg-surface p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl text-white-pure">Network Activity</h2>
          <p className="mt-1 text-sm text-text-secondary">Players Online</p>
        </div>
        <div className="inline-flex border border-border" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r.value}
              role="tab"
              aria-selected={range === r.value}
              onClick={() => setRange(r.value)}
              className={`focus-ring px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] transition-colors ${
                range === r.value ? "bg-accent text-bg" : "text-text-secondary hover:text-white-pure"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-48 w-full sm:h-56" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD}
            x2={W - PAD}
            y1={H - PAD - f * (H - PAD * 2)}
            y2={H - PAD - f * (H - PAD * 2)}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        ))}
        {areaPath && <path d={areaPath} fill="url(#activity-fill)" />}
        {linePath && (
          <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
        )}
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
        <span>{range === "24h" ? "24 hours ago" : range === "7d" ? "7 days ago" : "30 days ago"}</span>
        <span>Now</span>
      </div>
    </motion.div>
  );
}
