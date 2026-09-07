import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, type NetworkStatusSnapshot } from "./networkStatusStore";

export function useNetworkStatus(): NetworkStatusSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot);
}
