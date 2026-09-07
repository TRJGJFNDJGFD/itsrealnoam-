import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, Swords, Trophy } from "lucide-react";
import type { ActivityEvent, ActivityEventKind } from "../../data/types";
import { useNow } from "../../lib/useNow";
import { formatRelativeTime } from "../../lib/formatRelativeTime";

const ICONS: Record<ActivityEventKind, typeof LogIn> = {
  join: LogIn,
  leave: LogOut,
  kill: Swords,
  achievement: Trophy,
};

const ICON_COLOR: Record<ActivityEventKind, string> = {
  join: "text-accent",
  leave: "text-text-muted",
  kill: "text-[#C3524A]",
  achievement: "text-[#E0A64C]",
};

export default function LiveActivityFeed({ events }: { events: ActivityEvent[] }) {
  const now = useNow(1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border bg-surface p-6"
    >
      <h2 className="text-xl text-white-pure">Live Activity</h2>
      <p className="mt-1 text-sm text-text-secondary">What's happening on the network right now.</p>

      <ul className="mt-5 space-y-1">
        <AnimatePresence initial={false}>
          {events.map((event) => {
            const Icon = ICONS[event.kind];
            return (
              <motion.li
                key={event.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0"
              >
                <Icon size={15} className={`shrink-0 ${ICON_COLOR[event.kind]}`} />
                <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{event.message}</span>
                <span className="shrink-0 text-xs text-text-muted">{formatRelativeTime(event.timestamp, now)}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
