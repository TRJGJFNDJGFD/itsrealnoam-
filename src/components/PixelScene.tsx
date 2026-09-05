import { useMemo } from "react";

export type SceneVariant = "hero" | "practice" | "community";

type Props = {
  variant: SceneVariant;
  accent?: string;
  className?: string;
};

// tiny deterministic PRNG so every render (and every user) sees the same
// generated terrain — no hydration flicker, no true randomness needed.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSkyline(
  seed: number,
  count: number,
  x0: number,
  x1: number,
  minH: number,
  maxH: number
) {
  const rand = mulberry32(seed);
  const blockW = (x1 - x0) / count;
  const blocks: { x: number; w: number; h: number }[] = [];
  for (let i = 0; i < count; i++) {
    const w = blockW * (0.72 + rand() * 0.4);
    const h = minH + rand() * (maxH - minH);
    blocks.push({ x: x0 + i * blockW, w, h });
  }
  return blocks;
}

export default function PixelScene({ variant, accent = "#72C34A", className = "" }: Props) {
  const content = useMemo(() => {
    const W = 1600;
    const H = 900;

    if (variant === "practice") {
      const left = buildSkyline(11, 10, -40, W / 2 - 60, 90, 200);
      const right = buildSkyline(13, 10, W / 2 + 60, W + 40, 90, 200);
      return (
        <>
          {left.map((b, i) => (
            <rect key={`l${i}`} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="#101010" stroke="#1c1c18" />
          ))}
          {right.map((b, i) => (
            <rect key={`r${i}`} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="#101010" stroke="#1c1c18" />
          ))}
          <rect x={W / 2 - 2} y="0" width="4" height={H} fill="#4A9EC3" opacity="0.25" />
          <rect x={W / 2 - 60} y={H - 14} width="120" height="14" fill="#4A9EC3" opacity="0.3" />
        </>
      );
    }

    if (variant === "community") {
      const skyline = buildSkyline(29, 30, -20, W + 20, 60, 170);
      const stars = buildSkyline(31, 60, 0, W, 2, 3);
      return (
        <>
          {stars.map((s, i) => (
            <rect key={`s${i}`} x={s.x} y={40 + ((i * 53) % 420)} width="3" height="3" fill="#F5F5F0" opacity="0.2" />
          ))}
          {skyline.map((b, i) => (
            <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="#0A0A0A" stroke="#171712" />
          ))}
        </>
      );
    }

    // hero — the largest, most cinematic composition
    const far = buildSkyline(101, 22, -40, W + 40, 160, 340);
    const mid = buildSkyline(202, 26, -40, W + 40, 90, 220);
    const near = buildSkyline(303, 30, -40, W + 40, 40, 120);
    const particles = buildSkyline(404, 14, 0, W, 2, 5);
    return (
      <>
        {far.map((b, i) => (
          <rect key={`f${i}`} x={b.x} y={H - b.h - 140} width={b.w} height={b.h} fill="#0A0A0A" opacity="0.9" />
        ))}
        {mid.map((b, i) => (
          <rect key={`m${i}`} x={b.x} y={H - b.h - 60} width={b.w} height={b.h} fill="#0D0D0D" stroke="#171712" opacity="0.95" />
        ))}
        {near.map((b, i) => (
          <rect key={`n${i}`} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="#101010" stroke="#1c1c18" />
        ))}
        {particles.map((p, i) => (
          <rect
            key={`p${i}`}
            className="pixel-particle"
            x={p.x}
            y={120 + ((i * 61) % 300)}
            width="3"
            height="3"
            fill={accent}
            opacity="0.4"
            style={{
              animationDelay: `${(i * 0.7) % 6}s`,
              animationDuration: `${7 + (i % 5)}s`,
            }}
          />
        ))}
      </>
    );
  }, [variant, accent]);

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}
