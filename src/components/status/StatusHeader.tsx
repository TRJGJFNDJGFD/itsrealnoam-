import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useNow } from "../../lib/useNow";
import { formatRelativeTime } from "../../lib/formatRelativeTime";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  allOperational: boolean;
  lastUpdated: number | null;
};

export default function StatusHeader({ allOperational, lastUpdated }: Props) {
  const now = useNow(1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl text-white-pure sm:text-4xl">Network Status</h1>
          <span
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] ${
              allOperational ? "border-accent/40 text-accent" : "border-[#C3524A]/40 text-[#C3524A]"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {allOperational && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  allOperational ? "bg-accent" : "bg-[#C3524A]"
                }`}
              />
            </span>
            {allOperational ? "ALL SYSTEMS OPERATIONAL" : "PARTIAL OUTAGE"}
          </span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          Live network information updated in real time.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <RefreshCw size={13} />
        Last updated: {lastUpdated ? formatRelativeTime(lastUpdated, now) : "—"}
      </div>
    </motion.div>
  );
}
