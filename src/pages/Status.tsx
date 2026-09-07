import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PixelScene from "../components/PixelScene";
import { ToastProvider } from "../components/status/ToastProvider";
import StatusHeader, { type StatusVariant } from "../components/status/StatusHeader";
import NetworkOverview from "../components/status/NetworkOverview";
import ServerGrid from "../components/status/ServerGrid";
import PopularServers from "../components/status/PopularServers";
import { useNetworkStatus } from "../lib/useNetworkStatus";

function resolveVariant(reachable: boolean, status: "online" | "offline" | undefined, serversOnline: number | null, serversTotal: number | null): StatusVariant {
  if (!reachable) return "unavailable";
  if (status !== "online") return "offline";
  if (serversOnline !== null && serversTotal !== null && serversOnline !== serversTotal) return "partial";
  return "operational";
}

function StatusDashboard() {
  const { data, reachable, lastFetchedAt } = useNetworkStatus();
  const variant = resolveVariant(reachable, data?.status, data?.serversOnline ?? null, data?.serversTotal ?? null);
  const isLive = variant === "operational" || variant === "partial";

  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden pb-28 pt-32 lg:pt-36"
      >
        <PixelScene variant="community" className="absolute inset-0 h-full w-full opacity-[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg" />

        <div className="relative mx-auto flex max-w-(--container-page) flex-col gap-10 px-6 lg:px-10">
          <StatusHeader variant={variant} lastUpdated={data?.lastUpdated ?? null} />

          {!data && lastFetchedAt === null && (
            <p className="text-sm text-text-muted">Loading network status…</p>
          )}

          {isLive && data && (
            <>
              <NetworkOverview
                totalPlayers={data.totalPlayers ?? 0}
                serversOnline={data.serversOnline ?? 0}
                serversTotal={data.serversTotal ?? 0}
              />
              <ServerGrid servers={data.servers} />
              <PopularServers servers={data.servers} />
            </>
          )}

          {!isLive && data && lastFetchedAt !== null && (
            <p className="border border-border bg-surface p-6 text-sm text-text-secondary">
              {variant === "unavailable"
                ? "Couldn't reach the Status API. Live player and server counts will appear once it's back."
                : "The network hasn't sent a status update recently, so live numbers are hidden until it reconnects."}
            </p>
          )}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}

export default function Status() {
  return (
    <ToastProvider>
      <StatusDashboard />
    </ToastProvider>
  );
}
