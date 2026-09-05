import { motion } from "framer-motion";
import { SITE_CONFIG } from "../config/site";
import { useDiscordCounts } from "../lib/useDiscordCounts";
import PixelScene from "./PixelScene";
import CopyIP from "./CopyIP";

// Minimal, deliberate Discord mark — not the brand's purple, tinted to
// match Legend-IL's neutral palette instead.
function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

export default function CommunitySection() {
  const { memberCount, onlineCount } = useDiscordCounts();

  return (
    <section id="community" className="relative overflow-hidden bg-bg-secondary py-28 lg:py-36">
      <PixelScene variant="community" className="absolute inset-0 h-full w-full opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/70" />

      <div className="relative mx-auto max-w-(--container-page) px-6 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-accent">
            COMMUNITY
          </span>
          <h2 className="text-3xl text-white-pure sm:text-5xl">JOIN LEGEND-IL</h2>
          <p className="mx-auto mt-5 max-w-lg text-text-secondary">
            Find your squad, compete with other players and stay connected with the Legend-IL
            community.
          </p>

          {onlineCount !== null && (
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.1em] text-text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-accent">{onlineCount.toLocaleString()} ONLINE</span>
              {memberCount !== null && (
                <>
                  <span className="text-text-muted">·</span>
                  <span>{memberCount.toLocaleString()} MEMBERS</span>
                </>
              )}
            </div>
          )}

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href={SITE_CONFIG.discord}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="focus-ring flex items-center gap-2 bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-bg transition-colors hover:bg-accent-soft"
            >
              <DiscordIcon size={16} />
              JOIN DISCORD
            </motion.a>
            <CopyIP variant="compact" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
