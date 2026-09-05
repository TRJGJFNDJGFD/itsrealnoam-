import { useMemo } from "react";

export type SceneVariant = "hero" | "skymines" | "lifesteal" | "practice" | "community";

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

function buildIslands(seed: number, count: number, x0: number, x1: number, yBase: number) {
  const rand = mulberry32(seed);
  const islands: { x: number; y: number; w: number; h: number }[] = [];
  const step = (x1 - x0) / count;
  for (let i = 0; i < count; i++) {
    const w = step * (0.5 + rand() * 0.35);
    const h = 30 + rand() * 60;
    const y = yBase - rand() * 220;
    islands.push({ x: x0 + i * step + rand() * 20, y, w, h });
  }
  return islands;
}

export default function PixelScene({ variant, accent = "#72C34A", className = "" }: Props) {
  const content = useMemo(() => {
    const W = 1600;
    const H = 900;

    if (variant === "skymines") {
      const islands = buildIslands(42, 6, 60, 1540, 620);
      const stars = buildSkyline(7, 40, 0, W, 2, 4);
      return (
        <>
          {stars.map((s, i) => (
            <rect key={`s${i}`} x={s.x} y={80 + (i % 7) * 60} width="3" height="3" fill="#F5F5F0" opacity="0.25" />
          ))}
          {islands.map((isl, i) => (
            <g key={i} opacity={0.55 + (i % 3) * 0.15}>
              <rect x={isl.x} y={isl.y} width={isl.w} height={isl.h} fill="#101010" stroke="#242420" />
              <rect x={isl.x} y={isl.y} width={isl.w} height={Math.max(6, isl.h * 0.22)} fill={accent} opacity="0.18" />
              <rect x={isl.x + isl.w * 0.15} y={isl.y - 10} width={isl.w * 0.18} height="10" fill={accent} opacity="0.35" />
            </g>
          ))}
        </>
      );
    }

    if (variant === "lifesteal") {
      const near = buildSkyline(19, 26, -20, W + 20, 110, 260);
      const far = buildSkyline(3, 18, -20, W + 20, 60, 150);
      const hearts = [
        [220, 200],
        [1280, 260],
        [720, 140],
      ];
      return (
        <>
          {far.map((b, i) => (
            <rect key={`f${i}`} x={b.x} y={H - b.h - 60} width={b.w} height={b.h} fill="#0A0A0A" />
          ))}
          {near.map((b, i) => (
            <rect key={`n${i}`} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="#101010" stroke="#1c1c18" strokeWidth="1" />
          ))}
          {hearts.map(([hx, hy], i) => (
            <g key={i} opacity="0.5">
              <rect x={hx} y={hy} width="10" height="10" fill="#C3524A" />
              <rect x={hx - 10} y={hy} width="10" height="10" fill="#C3524A" />
              <rect x={hx + 10} y={hy} width="10" height="10" fill="#C3524A" />
              <rect x={hx - 5} y={hy + 10} width="10" height="10" fill="#C3524A" />
              <rect x={hx + 5} y={hy + 10} width="10" height="10" fill="#C3524A" />
              <rect x={hx} y={hy + 20} width="10" height="10" fill="#C3524A" />
            </g>
          ))}
        </>
      );
    }

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
          <rect key={`p${i}`} x={p.x} y={120 + ((i * 61) % 300)} width="3" height="3" fill={accent} opacity="0.4" />
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
