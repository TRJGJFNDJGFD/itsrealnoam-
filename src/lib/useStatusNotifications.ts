import { useCallback, useEffect, useRef, useState } from "react";
import { useNetworkStatus } from "./useNetworkStatus";

const STORAGE_KEY = "legendil-status-notify";

function supportsNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// Client-side-only "notify me" toggle: no server, no email, no push
// infrastructure — just the browser's own Notification API, firing while
// this tab is open and the network's live status flips. The opt-in is
// remembered per-browser via localStorage (a UI preference, not shared
// state, so localStorage is the right tool here).
export function useStatusNotifications() {
  const { data, reachable } = useNetworkStatus();
  const [enabled, setEnabled] = useState(readStoredPreference);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
    supportsNotifications() ? Notification.permission : "unsupported"
  );
  const previousStatus = useRef<"online" | "offline" | undefined>(undefined);

  const enable = useCallback(async () => {
    if (!supportsNotifications()) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setEnabled(true);
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // localStorage can throw in private browsing — the toggle just
        // won't persist across reloads, which is a harmless fallback.
      }
    }
  }, []);

  const disable = useCallback(() => {
    setEnabled(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // see enable() above
    }
  }, []);

  useEffect(() => {
    if (!enabled || permission !== "granted" || !reachable) return;
    const status = data?.status;
    if (status === undefined) return;

    if (previousStatus.current !== undefined && previousStatus.current !== status) {
      new Notification("Legend-IL", {
        body: status === "online" ? "The network is back online." : "The network just went offline.",
        icon: "/favicon.svg",
      });
    }
    previousStatus.current = status;
  }, [data?.status, enabled, permission, reachable]);

  return { enabled, permission, enable, disable };
}
