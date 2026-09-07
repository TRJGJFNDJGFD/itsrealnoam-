import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

// Tweens the displayed digits when `value` changes (e.g. 91 -> 94) instead
// of snapping instantly. Imperative framer-motion `animate()` doesn't
// inherit MotionConfig's reducedMotion setting, so reduced motion is
// checked directly here and just jumps to the new value.
export default function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState(() => value.toLocaleString());
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const unsubscribe = rounded.on("change", setDisplay);

    if (prefersReducedMotion.current) {
      motionValue.jump(value);
    } else {
      animate(motionValue, value, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{display}</span>;
}
