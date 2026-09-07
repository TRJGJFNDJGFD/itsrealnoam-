import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useNow } from "../../lib/useNow";
import { formatRelativeTime } from "../../lib/formatRelativeTime";

const ease = [0.16, 1, 0.3, 1] as const;

export type StatusVariant = "operational" | "partial" | "offline" | "unavailable";

const BADGE: Record<StatusVariant, { label: string; color: string; dot: string; pulse: boolean }> = {
  operational: { label: "ALL SYSTEMS OPERATIONAL", color: "text-accent", dot: "bg-accent", pulse: true },
  partial: { label: "PARTIAL OUTAGE", color: "text-[#E0A64C]", dot: "bg-[#E0A64C]", pulse: false },
  offline: { label: "NETWORK OFFLINE", color: "text-[#C3524A]", dot: "bg-[#C3524A]", pulse: false },
  unavailable: { label: "STATUS UNAVAILABLE", color: "text-text-muted", dot: "bg-text-muted", pulse: false },
};

type Props = {
  variant: StatusVariant;
  lastUpdated: string | null;
};

export default function StatusHeader({ variant, lastUpdated }: Props) {
  const now = useNow(1000);
  const badge = BADGE[variant];
  const lastUpdatedMs = lastUpdated ? Date.parse(lastUpdated) : null;

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
          <motion.span
            key={variant}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold tracking-[0.1em] ${badge.color} border-current/40`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {badge.pulse && (
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${badge.dot}`} />
              )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            </span>
            {badge.label}
          </motion.span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          {variant === "unavailable"
            ? "Network status is currently unavailable."
            : "Live network information updated in real time."}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <RefreshCw size={13} />
        {lastUpdatedMs ? `Last updated ${formatRelativeTime(lastUpdatedMs, now)}` : "No data yet"}
      </div>
    </motion.div>
  );
}
