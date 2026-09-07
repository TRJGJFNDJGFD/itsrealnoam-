import { Users, Server, Gauge, Wifi } from "lucide-react";
import type { NetworkStats } from "../../data/types";
import OverviewCard from "./OverviewCard";

function tpsSubtitle(tps: number) {
  if (tps >= 19.5) return "Excellent performance";
  if (tps >= 18) return "Good performance";
  return "Degraded performance";
}

function pingSubtitle(ping: number) {
  if (ping <= 60) return "Excellent connection";
  if (ping <= 120) return "Good connection";
  return "High latency";
}

export default function NetworkOverview({ stats }: { stats: NetworkStats }) {
  const cards = [
    {
      icon: Users,
      label: "Players Online",
      value: String(stats.playersOnline),
      subtitle: "Across the network",
    },
    {
      icon: Server,
      label: "Servers Online",
      value: `${stats.serversOnline} / ${stats.serversTotal}`,
      subtitle: stats.serversOnline === stats.serversTotal ? "All systems operational" : "Some servers unavailable",
    },
    {
      icon: Gauge,
      label: "Average TPS",
      value: stats.averageTps.toFixed(2),
      subtitle: tpsSubtitle(stats.averageTps),
    },
    {
      icon: Wifi,
      label: "Average Ping",
      value: `${stats.averagePing}ms`,
      subtitle: pingSubtitle(stats.averagePing),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <OverviewCard key={card.label} {...card} index={i} />
      ))}
    </div>
  );
}
