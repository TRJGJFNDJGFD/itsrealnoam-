import { Bell, BellOff } from "lucide-react";
import { useStatusNotifications } from "../../lib/useStatusNotifications";

export default function NotifyToggle() {
  const { enabled, permission, enable, disable } = useStatusNotifications();

  if (permission === "unsupported") return null;

  if (permission === "denied") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs text-text-muted"
        title="Notifications are blocked for this site in your browser settings."
      >
        <BellOff size={14} />
        Notifications blocked
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={enabled ? disable : enable}
      className={`focus-ring inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
        enabled
          ? "border-accent/40 text-accent hover:border-accent/60"
          : "border-border text-text-secondary hover:border-accent/40 hover:text-accent"
      }`}
    >
      {enabled ? <Bell size={14} /> : <BellOff size={14} />}
      {enabled ? "Notifications on" : "Notify me"}
    </button>
  );
}
