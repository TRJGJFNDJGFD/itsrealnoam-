import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../config/site";
import MobileMenu from "./MobileMenu";
import PixelMark from "./PixelMark";

const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "HOME", href: "#home" },
  { label: "GAMES", href: "#games" },
  { label: "FEATURES", href: "#features" },
  { label: "COMMUNITY", href: "#community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-(--container-page) items-center justify-between px-6 py-4 lg:px-10">
          <a href="#home" className="focus-ring flex items-center gap-2.5">
            <PixelMark size={34} />
            <span className="text-lg tracking-wide text-white-pure">LEGEND-IL</span>
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`focus-ring text-xs font-medium tracking-[0.15em] transition-colors hover:text-white-pure ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <a
            href={SITE_CONFIG.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden rounded-sm border border-border px-5 py-2 text-xs font-semibold tracking-[0.15em] text-text-primary transition-colors hover:border-accent/50 hover:text-accent md:inline-block"
          >
            DISCORD
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="focus-ring text-text-primary md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={LINKS} />
    </>
  );
}
