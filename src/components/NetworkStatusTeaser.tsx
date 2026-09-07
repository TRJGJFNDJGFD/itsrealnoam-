import { motion } from "framer-motion";
import { ArrowRight, Server, Users } from "lucide-react";
import RouteLink from "./RouteLink";
import { useNetworkOverview } from "../lib/useNetworkOverview";

// Deliberately compact — the full dashboard lives at /status. Numbers come
// from the same data layer (src/data/api.ts) that page uses, so the two
// never disagree.
export default function NetworkStatusTeaser() {
  const { stats } = useNetworkOverview();
  const allOperational = stats ? stats.serversOnline === stats.serversTotal : true;

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
                  {allOperational && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  )}
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${allOperational ? "bg-accent" : "bg-[#C3524A]"}`} />
                </span>
                <h3 className="text-lg text-white-pure">Legend-IL Network</h3>
              </div>
              <p className={`mt-1 text-sm font-semibold ${allOperational ? "text-accent" : "text-[#C3524A]"}`}>
                {allOperational ? "All Systems Operational" : "Partial Outage"}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-text-muted" />
                  {stats ? stats.playersOnline : "—"} Players Online
                </span>
                <span className="flex items-center gap-1.5">
                  <Server size={14} className="text-text-muted" />
                  {stats ? `${stats.serversOnline} / ${stats.serversTotal}` : "—"} Servers Online
                </span>
              </div>
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
