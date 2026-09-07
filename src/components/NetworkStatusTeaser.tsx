import { motion } from "framer-motion";
import { ArrowRight, Server, Users } from "lucide-react";
import RouteLink from "./RouteLink";
import AnimatedNumber from "./AnimatedNumber";
import { useNetworkStatus } from "../lib/useNetworkStatus";

// Deliberately compact — the full dashboard lives at /status. Both read
// from the same live Status API (src/lib/networkStatusStore.ts), so the
// two can never disagree — and neither ever shows stale numbers as current.
export default function NetworkStatusTeaser() {
  const { data, reachable, lastFetchedAt } = useNetworkStatus();

  const live = reachable && lastFetchedAt !== null && data?.status === "online";
  const allOperational = live && data!.serversOnline === data!.serversTotal;
  const dotColor = live ? (allOperational ? "bg-accent" : "bg-[#E0A64C]") : "bg-text-muted";
  const labelColor = live ? (allOperational ? "text-accent" : "text-[#E0A64C]") : "text-text-muted";
  const label = !live ? "STATUS UNAVAILABLE" : allOperational ? "ALL SYSTEMS OPERATIONAL" : "PARTIAL OUTAGE";

  return (
    <section className="relative bg-bg py-16 lg:py-20">
      <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <RouteLink
            href="/status"
            className="focus-ring group flex flex-col gap-6 border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/30 hover:bg-surface-light sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  {live && (
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dotColor}`} />
                  )}
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
                </span>
                <h3 className="text-lg text-white-pure">Legend-IL Network</h3>
              </div>
              <p className={`mt-1 text-sm font-semibold ${labelColor}`}>{label}</p>

              {live ? (
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-text-muted" />
                    <AnimatedNumber value={data!.totalPlayers ?? 0} /> Players Online
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Server size={14} className="text-text-muted" />
                    {data!.serversOnline} / {data!.serversTotal} Servers Online
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-text-secondary">
                  Network status is currently unavailable.
                </p>
              )}
            </div>

            <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold tracking-wide text-accent">
              View Full Status
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </RouteLink>
        </motion.div>
      </div>
    </section>
  );
}
