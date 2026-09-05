import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { GameMode } from "../config/site";
import { SITE_CONFIG } from "../config/site";
import PixelScene from "./PixelScene";

type Props = {
  game: GameMode;
  size?: "large" | "medium";
};

export default function GameCard({ game, size = "medium" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handlePlay() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Copy server IP to play ${game.displayName}`}
      className={`focus-ring group relative block w-full overflow-hidden bg-surface text-left transition-all duration-300 ${
        size === "large" ? "aspect-[16/9]" : "aspect-[4/5] sm:aspect-[16/11]"
      }`}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.05]">
        <PixelScene variant={game.id} accent={game.accent} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to top, ${game.accent}22, transparent 55%)`,
        }}
      />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <span
          className="mb-2 text-[11px] font-semibold tracking-[0.2em]"
          style={{ color: game.accent }}
        >
          {game.subtitle}
        </span>
        <h3 className="text-2xl text-white-pure transition-colors sm:text-3xl">
          {game.displayName}
        </h3>
        <p className="mt-3 max-w-sm text-sm text-text-secondary">{game.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="border px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] text-text-secondary"
              style={{ borderColor: `${game.accent}40` }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="mt-5 flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-text-primary"
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check size={14} style={{ color: game.accent }} />
              <span style={{ color: game.accent }}>IP COPIED</span>
            </>
          ) : (
            <>
              PLAY NOW
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
