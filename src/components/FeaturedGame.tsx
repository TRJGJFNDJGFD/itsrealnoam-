import { motion } from "framer-motion";
import { SITE_CONFIG } from "../config/site";
import PixelScene from "./PixelScene";

const STATS = ["CUSTOM PROGRESSION", "UPGRADES", "ECONOMY"];

export default function FeaturedGame() {
  async function handlePlay() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
    } catch {
      /* no-op */
    }
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-bg-secondary py-28 lg:py-36">
      <PixelScene variant="skymines" accent={SITE_CONFIG.accent} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40" />

      <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-accent">
            SKYMINES
          </span>
          <h2 className="text-3xl leading-tight text-white-pure sm:text-5xl">
            THE SKY IS YOURS
          </h2>
          <p className="mt-5 text-text-secondary">
            Start with nothing. Mine. Upgrade. Build your fortune.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {STATS.map((stat) => (
              <span
                key={stat}
                className="text-xs font-semibold tracking-[0.15em] text-text-secondary"
              >
                {stat}
              </span>
            ))}
          </div>

          <button
            onClick={handlePlay}
            className="focus-ring mt-10 inline-flex bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-accent-soft"
          >
            PLAY SKYMINES
          </button>
        </motion.div>
      </div>
    </section>
  );
}
