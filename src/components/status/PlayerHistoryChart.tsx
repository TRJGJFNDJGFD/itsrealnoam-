import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { fetchPlayerHistory, type HistoryPoint } from "../../lib/statusApi";

const WIDTH = 800;
const HEIGHT = 200;
const PADDING = 24;

function buildPath(points: HistoryPoint[], maxPlayers: number): { line: string; area: string } {
  if (points.length === 0) return { line: "", area: "" };

  const first = points[0].t;
  const last = points[points.length - 1].t;
  const span = Math.max(last - first, 1);
  const top = Math.max(maxPlayers, 1);

  const coords = points.map((point) => {
    const x = PADDING + ((point.t - first) / span) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - (point.p / top) * (HEIGHT - PADDING * 2);
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${HEIGHT - PADDING} L${coords[0][0].toFixed(1)},${HEIGHT - PADDING} Z`;

  return { line, area };
}

export default function PlayerHistoryChart() {
  const [points, setPoints] = useState<HistoryPoint[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchPlayerHistory();
        if (!cancelled) setPoints(data);
      } catch {
        if (!cancelled) setPoints([]);
      }
    }

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (points === null) return null;
  if (points.length < 2) return null;

  const maxPlayers = Math.max(...points.map((p) => p.p));
  const { line, area } = buildPath(points, maxPlayers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border bg-surface p-6"
    >
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-text-secondary">
        <TrendingUp size={15} className="text-accent" />
        PLAYER HISTORY (24H)
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-4 h-40 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Player count over the last 24 hours"
      >
        <defs>
          <linearGradient id="history-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#history-fill)" stroke="none" />
        <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>

      <div className="mt-2 flex justify-between text-xs text-text-muted">
        <span>24h ago</span>
        <span>Peak: {maxPlayers} players</span>
        <span>Now</span>
      </div>
    </motion.div>
  );
}
