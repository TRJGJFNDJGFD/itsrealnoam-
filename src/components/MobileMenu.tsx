import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

type Link = { label: string; href: string; external?: boolean };

type Props = {
  open: boolean;
  onClose: () => void;
  links: Link[];
};

export default function MobileMenu({ open, onClose, links }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col justify-center bg-bg/95 px-8 md:hidden"
        >
          <nav className="flex flex-col gap-7" aria-label="Mobile">
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={onClose}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.96 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className="focus-ring text-3xl text-text-primary transition-colors hover:text-accent"
              >
                {link.label}
              </motion.a>
            ))}
            {SITE_CONFIG.vote && (
              <motion.a
                href={SITE_CONFIG.vote}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.96 }}
                transition={{ delay: 0.05 * links.length, duration: 0.3 }}
                className="focus-ring flex items-center gap-2 text-3xl text-text-primary transition-colors hover:text-accent"
              >
                <ThumbsUp size={22} />
                VOTE
              </motion.a>
            )}
            <motion.a
              href={SITE_CONFIG.discord}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.96 }}
              transition={{ delay: 0.05 * (links.length + (SITE_CONFIG.vote ? 1 : 0)), duration: 0.3 }}
              className="focus-ring text-3xl text-accent"
            >
              DISCORD
            </motion.a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
