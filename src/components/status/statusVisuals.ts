// Reuses the site's existing accent (gold) for "online" — that's already
// the established online/active color everywhere else on the site (Hero,
// ServerStatus, Community). Only online/offline exist today because
// that's all Velocity can tell us reliably; "starting"/"maintenance" can
// be added here once a real source for those states exists.
export const STATUS_VISUALS: Record<
  "online" | "offline",
  { label: string; dot: string; text: string; border: string }
> = {
  online: { label: "ONLINE", dot: "#E8B84F", text: "text-accent", border: "border-accent/40" },
  offline: { label: "OFFLINE", dot: "#C3524A", text: "text-[#C3524A]", border: "border-[#C3524A]/40" },
};

export function getStatusVisual(status: "online" | "offline") {
  return STATUS_VISUALS[status];
}
