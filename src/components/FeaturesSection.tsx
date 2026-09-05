import { motion } from "framer-motion";
import { Swords, Trophy, TrendingUp, Users } from "lucide-react";
import { FEATURES } from "../config/site";

const ICONS: Record<
  string,
  React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  gameplay: Swords,
  competitive: Trophy,
  progression: TrendingUp,
  community: Users,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-(--container-page) px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-xl"
        >
          <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-accent">
            WHY LEGEND-IL
          </span>
          <h2 className="text-3xl text-white-pure sm:text-4xl">BUILT FOR PLAYERS</h2>
          <p className="mt-4 text-text-secondary">
            Everything Legend-IL needs to feel like more than another Minecraft server.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.id] ?? Swords;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="group bg-surface p-7 transition-colors hover:bg-surface-light"
              >
                <Icon size={22} strokeWidth={1.5} className="text-accent" />
                <h3 className="mt-5 text-base font-semibold text-white-pure">{feature.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
