import { motion } from "framer-motion";
import { SITE_CONFIG } from "../../config/site";
import { useToast } from "../../lib/toastContext";

// All Legend-IL game modes are reached through the same network address
// (routed to the right server once connected) — this always copies
// SITE_CONFIG.ip, the same address used everywhere else on the site, never
// a per-server IP that doesn't exist in the project's config.
export default function QuickJoinButton({ className = "" }: { className?: string }) {
  const showToast = useToast();

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
      showToast("Server IP copied!");
    } catch {
      /* clipboard unavailable — nothing to fall back to here */
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`focus-ring bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-bg transition-colors hover:bg-accent-soft ${className}`}
    >
      PLAY NOW
    </motion.button>
  );
}
