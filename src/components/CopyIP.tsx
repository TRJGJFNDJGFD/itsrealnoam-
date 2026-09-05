import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

type Props = {
  variant?: "default" | "compact";
  className?: string;
};

const iconTransition = { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };

export default function CopyIP({ variant = "default", className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleCopy}
        aria-live="polite"
        className={`focus-ring group inline-flex items-center gap-2 rounded-sm border bg-surface px-4 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:border-accent/40 hover:text-white active:scale-[0.98] ${
          copied ? "border-accent/60" : "border-border"
        }`}
      >
        <span className="font-mono">{SITE_CONFIG.ip}</span>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={iconTransition}
              className="flex"
            >
              <Check size={14} className="text-accent" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={iconTransition}
              className="flex"
            >
              <Copy size={14} className="text-text-muted group-hover:text-accent" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div
      className={`focus-ring group flex items-center justify-between gap-4 rounded-sm border bg-surface/80 px-5 py-3.5 backdrop-blur-sm transition-all duration-200 hover:border-accent/40 ${
        copied ? "border-accent/60" : "border-border"
      } ${className}`}
    >
      <span className="font-mono text-sm text-text-primary sm:text-base">{SITE_CONFIG.ip}</span>
      <button
        onClick={handleCopy}
        aria-label="Copy server IP"
        aria-live="polite"
        className="focus-ring flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-secondary transition-colors hover:text-accent active:scale-[0.97]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={iconTransition}
              className="flex items-center gap-1.5"
            >
              <Check size={14} className="text-accent" />
              <span className="text-accent">COPIED</span>
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={iconTransition}
              className="flex items-center gap-1.5"
            >
              <Copy size={14} />
              COPY
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
