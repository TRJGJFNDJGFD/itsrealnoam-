import { useEffect, useState } from "react";

// Minimal path-based router — the site only has two pages, so a full
// routing library isn't worth the dependency. navigate() does a
// client-side transition (no full reload); a hard refresh or direct URL
// still works because index.html is served for every path in dev, and
// vercel.json/_redirects do the same for static hosting in production.
export function navigate(href: string) {
  const url = new URL(href, window.location.origin);
  if (url.pathname === window.location.pathname && url.hash === window.location.hash) return;
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return pathname;
}
