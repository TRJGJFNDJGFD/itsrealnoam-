import { useEffect, useRef } from "react";

// Subtle cursor-driven depth for background decoration. Writes directly to
// the DOM via a ref (transform only) instead of React state, so mouse
// movement never triggers a re-render. Automatically inert on touch
// devices (no fine pointer) and when the user prefers reduced motion.
export function useCursorParallax<T extends HTMLElement>(strength = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    function apply() {
      frame = 0;
      if (el) el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }

    function onPointerMove(e: PointerEvent) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2 * strength;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2 * strength;
      if (!frame) frame = requestAnimationFrame(apply);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}
