import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle: string;
  index: number;
};

export default function OverviewCard({ icon: Icon, label, value, subtitle, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/30 hover:bg-surface-light"
    >
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-text-secondary">
        <Icon size={15} className="text-accent" />
        {label.toUpperCase()}
      </div>
      <div className="mt-3 text-4xl font-semibold text-white-pure">{value}</div>
      <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
    </motion.div>
  );
}
