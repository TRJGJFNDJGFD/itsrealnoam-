import { fetchNetworkStatus, isStatusApiConfigured, type StatusApiResponse } from "./statusApi";

const POLL_MS = 5000;

export type NetworkStatusSnapshot = {
  data: StatusApiResponse | null;
  // false only when the API itself couldn't be reached at all (down,
  // misconfigured, network error) — distinct from the API reporting the
  // Minecraft network itself as offline, which still means "reachable".
  reachable: boolean;
  lastFetchedAt: number | null;
};

// A single shared poller behind every consumer of useNetworkStatus(), so
// mounting it in several places at once (Hero, the homepage teaser, and
// /status all in the same session) still only ever runs one interval and
// one in-flight request cycle — never a duplicate.
let snapshot: NetworkStatusSnapshot = { data: null, reachable: true, lastFetchedAt: null };
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let inFlight = false;

async function poll() {
  if (inFlight) return;
  inFlight = true;
  try {
    const data = await fetchNetworkStatus();
    snapshot = { data, reachable: true, lastFetchedAt: Date.now() };
  } catch {
    snapshot = { ...snapshot, reachable: false, lastFetchedAt: Date.now() };
  } finally {
    inFlight = false;
  }
  listeners.forEach((listener) => listener());
}

function start() {
  if (intervalId !== null || !isStatusApiConfigured()) return;
  poll();
  intervalId = setInterval(poll, POLL_MS);
}

function stop() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getSnapshot(): NetworkStatusSnapshot {
  return snapshot;
}
