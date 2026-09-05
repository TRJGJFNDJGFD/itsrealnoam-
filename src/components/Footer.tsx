import { SITE_CONFIG } from "../config/site";
import PixelMark from "./PixelMark";

const LINKS = [
  { label: "HOME", href: "#home" },
  { label: "GAMES", href: "#games" },
  { label: "FEATURES", href: "#features" },
  { label: "COMMUNITY", href: "#community" },
  { label: "DISCORD", href: SITE_CONFIG.discord },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-(--container-page) px-6 py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <div className="flex items-center gap-2.5">
              <PixelMark size={30} />
              <span className="text-lg text-white-pure">LEGEND-IL</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              {SITE_CONFIG.description}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end" aria-label="Footer">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="focus-ring text-xs font-medium tracking-[0.15em] text-text-secondary transition-colors hover:text-white-pure"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono">{SITE_CONFIG.ip}</span>
            <span>© 2026 Legend-IL</span>
          </div>
          <span>Not affiliated with Mojang or Microsoft.</span>
        </div>
      </div>
    </footer>
  );
}
