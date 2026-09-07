import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PixelScene from "../components/PixelScene";
import { ToastProvider } from "../components/status/ToastProvider";
import StatusHeader from "../components/status/StatusHeader";
import NetworkOverview from "../components/status/NetworkOverview";
import ServerGrid from "../components/status/ServerGrid";
import PlayerList from "../components/status/PlayerList";
import NetworkActivityChart from "../components/status/NetworkActivityChart";
import LiveActivityFeed from "../components/status/LiveActivityFeed";
import PopularServers from "../components/status/PopularServers";
import UptimeTimeline from "../components/status/UptimeTimeline";
import { useNetworkOverview } from "../lib/useNetworkOverview";
import { useServers } from "../lib/useServers";
import { usePlayers } from "../lib/usePlayers";
import { useLiveActivity } from "../lib/useLiveActivity";
import { useUptime } from "../lib/useUptime";

function StatusDashboard() {
  const { stats, lastUpdated } = useNetworkOverview();
  const { servers } = useServers();
  const { players } = usePlayers();
  const { events } = useLiveActivity();
  const uptime = useUptime();

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
          <StatusHeader allOperational={stats ? stats.serversOnline === stats.serversTotal : true} lastUpdated={lastUpdated} />

          {stats && <NetworkOverview stats={stats} />}

          <ServerGrid servers={servers} />

          <PlayerList players={players} servers={servers} />

          <NetworkActivityChart />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LiveActivityFeed events={events} />
            <PopularServers servers={servers} />
          </div>

          <UptimeTimeline percent={uptime.percent} timeline={uptime.timeline} />
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
