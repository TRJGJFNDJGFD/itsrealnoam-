import { SITE_CONFIG } from "../config/site";
import PixelScene from "./PixelScene";

// Fills the third slot in the games grid until the next mode is confirmed.
// Swap this out for a real <GameCard game={...} /> once you have one.
export default function ComingSoonCard() {
  return (
    <a
      href={SITE_CONFIG.discord}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group relative block aspect-[4/5] overflow-hidden bg-surface transition-all duration-300 sm:aspect-[16/11]"
    >
      <div className="absolute inset-0 opacity-40 grayscale">
        <PixelScene variant="hero" accent={SITE_CONFIG.accent} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/50" />

      <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
        <span className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-text-muted">
          MORE MODES
        </span>
        <h3 className="text-2xl text-white-pure sm:text-3xl">COMING SOON</h3>
        <p className="mt-3 max-w-xs text-sm text-text-secondary">
          Join the Discord to be first to know when the next mode goes live.
        </p>
      </div>
    </a>
  );
}
