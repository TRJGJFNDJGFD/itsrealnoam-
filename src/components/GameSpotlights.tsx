import { motion } from "framer-motion";
import { SITE_CONFIG, GAMES } from "../config/site";
import PixelScene from "./PixelScene";

// A deep-dive block per game mode — SkyMines and Lifesteal each get equal
// visual weight here (alternating image side, own accent, own copy) so
// neither mode reads as an afterthought next to the other.
export default function GameSpotlights() {
  async function handlePlay() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
    } catch {
      /* no-op */
    }
  }

  return (
    <>
      {GAMES.map((game, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={game.id}
            className="relative overflow-hidden border-y border-border bg-bg-secondary py-24 lg:py-32"
          >
            <PixelScene
              variant={game.id}
              accent={game.accent}
              className="absolute inset-0 h-full w-full opacity-60"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40 ${
                reversed ? "scale-x-[-1]" : ""
              }`}
            />

            <div className="relative mx-auto max-w-(--container-page) px-6 lg:px-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className={`max-w-xl ${reversed ? "ml-auto text-right" : ""}`}
              >
                <span
                  className="mb-3 block text-xs font-semibold tracking-[0.25em]"
                  style={{ color: game.accent }}
                >
                  {game.displayName}
                </span>
                <h2 className="text-3xl leading-tight text-white-pure sm:text-5xl">
                  {game.subtitle}
                </h2>
                <p className="mt-5 text-text-secondary">{game.description}</p>

                <div
                  className={`mt-8 flex flex-wrap gap-x-8 gap-y-3 ${
                    reversed ? "justify-end" : ""
                  }`}
                >
                  {game.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-xs font-semibold tracking-[0.15em] text-text-secondary"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePlay}
                  className="focus-ring mt-10 inline-flex px-7 py-3.5 text-sm font-semibold tracking-wide text-bg transition-[filter] hover:brightness-110"
                  style={{ backgroundColor: game.accent }}
                >
                  PLAY {game.displayName}
                </button>
              </motion.div>
            </div>
          </section>
        );
      })}
    </>
  );
}
