import { useEffect, useState } from "react";
import type { StaffMemberRef } from "../config/staff";

type Profile = { name: string; avatarUrl: string };

// Resolves a staff member's *current* Minecraft name and skin head client
// side (PlayerDB, a public Mojang-backed lookup) instead of hardcoding a
// name/skin that goes stale the moment they rename or change skins.
//
// Looking this up by `uuid` (a Minecraft account's permanent, never-changing
// ID) survives renames forever. Looking it up by `username` only works
// until they rename — Mojang's own lookup only resolves a name that
// currently belongs to that account. Either way, if the lookup fails for
// any reason (offline, renamed with no uuid on file, etc.) this falls back
// to showing the last-known username as plain text with no head icon,
// rather than a broken image or a stale/wrong name.
export function useMinecraftProfile(ref: StaffMemberRef): { profile: Profile | null; loading: boolean } {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const key = ref.uuid ?? ref.username;

  useEffect(() => {
    let cancelled = false;

    fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(key)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        const player = json?.success ? json.data?.player : null;
        if (player?.username && player?.id) {
          setProfile({
            name: player.username,
            avatarUrl: `https://mc-heads.net/avatar/${player.id}/64`,
          });
        }
      })
      .catch(() => {
        // Network blocked, offline, or the name/uuid no longer resolves —
        // handled by leaving profile as null (caller falls back).
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { profile, loading };
}
