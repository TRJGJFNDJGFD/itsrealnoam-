import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../config/site";
import MobileMenu from "./MobileMenu";
import PixelMark from "./PixelMark";
import VoteButton from "./VoteButton";

const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "HOME", href: "#home" },
  { label: "JOIN", href: "#join" },
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
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-(--container-page) items-center justify-between px-6 py-4 lg:px-10">
          <a href="#home" className="focus-ring flex items-center gap-2.5">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <PixelMark size={34} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg tracking-wide text-white-pure"
            >
              LEGEND-IL
            </motion.span>
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map((link, i) => {
              const isActive = active === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 + i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`focus-ring group relative py-1 text-xs font-medium tracking-[0.15em] transition-colors hover:text-white-pure ${
                    isActive ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  />
                </motion.a>
              );
            })}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden items-center gap-5 md:flex"
          >
            <VoteButton variant="nav" />
            <a
              href={SITE_CONFIG.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-sm border border-border px-5 py-2 text-xs font-semibold tracking-[0.15em] text-text-primary transition-colors hover:border-accent/50 hover:text-accent"
            >
              DISCORD
            </a>
          </motion.div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="focus-ring relative text-text-primary md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={LINKS} />
    </>
  );
}
