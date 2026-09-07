import { Users, Server } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedNumber from "../AnimatedNumber";

type Props = {
  totalPlayers: number;
  serversOnline: number;
  serversTotal: number;
};

export default function NetworkOverview({ totalPlayers, serversOnline, serversTotal }: Props) {
  const cards = [
    {
      icon: Users,
      label: "Players Online",
      value: <AnimatedNumber value={totalPlayers} />,
      subtitle: "Across the network",
    },
    {
      icon: Server,
      label: "Servers Online",
      value: `${serversOnline} / ${serversTotal}`,
      subtitle: serversOnline === serversTotal ? "All systems operational" : "Some servers unavailable",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/30 hover:bg-surface-light"
        >
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-text-secondary">
            <card.icon size={15} className="text-accent" />
            {card.label.toUpperCase()}
          </div>
          <div className="mt-3 text-4xl font-semibold text-white-pure">{card.value}</div>
          <p className="mt-1.5 text-sm text-text-muted">{card.subtitle}</p>
        </motion.div>
      ))}
    </div>
  );
}
