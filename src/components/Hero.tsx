import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Play } from "lucide-react";
import { SITE_CONFIG } from "../config/site";
import PixelScene from "./PixelScene";
import CopyIP from "./CopyIP";
import ServerStatus from "./ServerStatus";
import { useCursorParallax } from "../lib/useCursorParallax";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const sceneRef = useCursorParallax<HTMLDivElement>(10);
  const gridRef = useCursorParallax<HTMLDivElement>(4);

  async function handlePlayNow() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable — the visible IP below still works */
    }
  }

  return (
    <section id="home" className="relative flex min-h-screen items-end overflow-hidden bg-bg">
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0"
      >
        <div ref={sceneRef} className="absolute -inset-4">
          <PixelScene variant="hero" className="h-full w-full" />
        </div>
        <div ref={gridRef} className="bg-pixel-grid absolute -inset-4 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-(--container-page) px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-text-secondary"
        >
          <span className="h-1.5 w-1.5 bg-accent" />
          MINECRAFT NETWORK
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="text-balance text-[clamp(4rem,11vw,11rem)] leading-[0.9] text-white-pure"
        >
          LEGEND<span className="text-accent">-</span>IL
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease }}
          className="mt-5 max-w-xl text-lg font-medium tracking-wide text-text-secondary sm:text-xl"
        >
          BECOME A LEGEND.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.6, ease }}
          className="mt-3 max-w-md text-sm text-text-muted sm:text-base"
        >
          A new Minecraft network is rising. Join early and make your mark from day one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.76, duration: 0.6, ease }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <motion.button
            onClick={handlePlayNow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            aria-live="polite"
            className="focus-ring group flex items-center gap-2 bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-accent-soft"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} />
                  IP COPIED!
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  PLAY NOW
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.a
            href={SITE_CONFIG.discord}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="focus-ring border border-border px-7 py-3.5 text-sm font-semibold tracking-wide text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
          >
            JOIN DISCORD
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <CopyIP className="max-w-xs" />
          <ServerStatus />
        </motion.div>
      </div>
    </section>
  );
}
