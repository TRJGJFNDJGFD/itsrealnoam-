import type { ServerStatusKind } from "../../data/types";

// Reuses the site's existing accent (gold) for "online" — that's already
// the established online/active color everywhere else on the site (Hero,
// ServerStatus, Community). The other three states aren't used elsewhere
// yet, so they get restrained, desaturated hues that stay inside the same
// dark palette instead of introducing clashing bright colors.
export const STATUS_VISUALS: Record<
  ServerStatusKind,
  { label: string; dot: string; text: string; border: string }
> = {
  online: { label: "ONLINE", dot: "#E8B84F", text: "text-accent", border: "border-accent/40" },
  starting: { label: "STARTING", dot: "#E0A64C", text: "text-[#E0A64C]", border: "border-[#E0A64C]/40" },
  maintenance: { label: "MAINTENANCE", dot: "#9B7FD4", text: "text-[#9B7FD4]", border: "border-[#9B7FD4]/40" },
  offline: { label: "OFFLINE", dot: "#C3524A", text: "text-[#C3524A]", border: "border-[#C3524A]/40" },
};

export function getStatusVisual(status: ServerStatusKind) {
  return STATUS_VISUALS[status];
}
