import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

type Props = {
  variant?: "nav" | "outline";
  className?: string;
};

// Renders nothing until SITE_CONFIG.vote is set — never link to a listing
// that doesn't exist yet.
export default function VoteButton({ variant = "outline", className = "" }: Props) {
  if (!SITE_CONFIG.vote) return null;

  if (variant === "nav") {
    return (
      <motion.a
        href={SITE_CONFIG.vote}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className={`focus-ring group relative flex items-center gap-1.5 py-1 text-xs font-medium tracking-[0.15em] text-text-secondary transition-colors hover:text-accent ${className}`}
      >
        <ThumbsUp size={13} className="transition-transform duration-200 group-hover:-rotate-6" />
        VOTE
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
      </motion.a>
    );
  }

  return (
    <motion.a
      href={SITE_CONFIG.vote}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`focus-ring group inline-flex items-center gap-2 border border-accent/40 px-7 py-3.5 text-sm font-semibold tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/10 ${className}`}
    >
      <ThumbsUp size={16} className="transition-transform duration-200 group-hover:-rotate-6" />
      VOTE FOR THE SERVER
    </motion.a>
  );
}
