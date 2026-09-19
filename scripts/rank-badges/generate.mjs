import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

// Silkscreen Bold — the same pixel-grid font Legend-IL's own site uses
// (src/styles/fonts.css) as the freely-licensed stand-in for Minecraft's
// real typeface, so these badges match the website's type system.
const FONT_B64 = readFileSync(new URL("./assets/Silkscreen-Bold.ttf", import.meta.url)).toString("base64");

// ---- rank data -------------------------------------------------------

const RANKS = [
  // STAFF / MANAGEMENT
  { id: "founder", name: "FOUNDER", tier: "crown",
    main: "#FFD700", light: "#FFF6D0", dark: "#7A5A00", glow: "#FFE680" },
  { id: "owner", name: "OWNER", tier: "royal",
    main: "#C41E1E", light: "#FF6B6B", dark: "#4D0000", glow: "#FF3B3B" },
  { id: "co-owner", name: "CO-OWNER", tier: "royal",
    main: "#E8484A", light: "#FF9A9A", dark: "#7A1414", glow: "#FF7070" },
  { id: "staff-manager", name: "STAFF MANAGER", tier: "royal",
    main: "#FF9C90", light: "#FFD3CB", dark: "#B0564A", glow: "#FFB6AA" },
  { id: "manager", name: "MANAGER", tier: "elite",
    main: "#FF6F00", light: "#FFB74D", dark: "#7A3600", glow: "#FFA040" },
  { id: "admin", name: "ADMIN", tier: "elite",
    main: "#FFA451", light: "#FFDBA6", dark: "#9C5A1E", glow: "#FFC078" },

  // DEVELOPMENT / BUILD
  { id: "s-developer", name: "S-DEVELOPER", tier: "elite",
    main: "#6EE7F2", light: "#D0FBFF", dark: "#0E7C8C", glow: "#8FEFFA" },
  { id: "s-configuring", name: "S-CONFIGURING", tier: "elite",
    main: "#22D3EE", light: "#9BF1FB", dark: "#0A6E80", glow: "#4FE0F0" },
  { id: "s-builder", name: "S-BUILDER", tier: "elite",
    main: "#FFB300", light: "#FFE082", dark: "#8A5A00", glow: "#FFD54F", dual: "#FFD500", hazard: true },
  { id: "developer", name: "DEVELOPER", tier: "standard",
    main: "#4FA8FF", light: "#BFDDFF", dark: "#1A4D8A", glow: "#7FC0FF" },
  { id: "configuring", name: "CONFIGURING", tier: "standard",
    main: "#0FB8C9", light: "#8CEAF2", dark: "#075C66", glow: "#2FD0DE" },
  { id: "builder", name: "BUILDER", tier: "standard",
    main: "#FFD500", light: "#FFF3A0", dark: "#8A7300", glow: "#FFE64D" },

  // MODERATION / COMMUNITY
  { id: "mod", name: "MOD", tier: "standard",
    main: "#2ECC71", light: "#A6F2C4", dark: "#14622F", glow: "#4FE08A" },
  { id: "helper", name: "HELPER", tier: "standard",
    main: "#3B82F6", light: "#B3D1FE", dark: "#1E3A8A", glow: "#6BA3FF" },
  { id: "media", name: "MEDIA", tier: "standard",
    main: "#9B59B6", light: "#E0C6EE", dark: "#4A2359", glow: "#C084E8" },
  { id: "friend", name: "FRIEND", tier: "standard",
    main: "#C6A8F0", light: "#EBDFFB", dark: "#6B4A94", glow: "#D9BFF7" },

  // DONATOR / PREMIUM
  { id: "legendmaster", name: "LEGENDMASTER", tier: "crown",
    main: "#FFC71F", light: "#FFF0B8", dark: "#7A5200", glow: "#FFDD55", dual: "#FFEE99" },
  { id: "legendpro", name: "LEGENDPRO", tier: "royal",
    main: "#FFEB3B", light: "#FFFAD1", dark: "#8A7A00", glow: "#FFF176" },
  { id: "legend", name: "LEGEND", tier: "elite",
    main: "#F5E6A8", light: "#FCF7E3", dark: "#A08A4A", glow: "#F0E0A0" },
  { id: "mvp", name: "MVP", tier: "royal",
    main: "#D6006B", light: "#FF7FC0", dark: "#6E0038", glow: "#FF3D94" },
  { id: "vip", name: "VIP", tier: "standard",
    main: "#1ABC9C", light: "#8FF2E0", dark: "#0B6B58", glow: "#4FE0C8" },
];

// ---- geometry per tier -------------------------------------------------

const TIER = {
  crown:    { glowBlur: 13, glowWidth: 9,  borderW: 4, innerW: 1.4, corner: "diamond", accent: true,  particles: 6, sheen: true  },
  royal:    { glowBlur: 9,  glowWidth: 7,  borderW: 3.4, innerW: 1.2, corner: "bracket", accent: true,  particles: 4, sheen: true  },
  elite:    { glowBlur: 6,  glowWidth: 5,  borderW: 2.6, innerW: 1,   corner: "notch",   accent: false, particles: 2, sheen: false },
  standard: { glowBlur: 4,  glowWidth: 3.5,borderW: 2,   innerW: 0.8, corner: "tick",    accent: false, particles: 0, sheen: false },
};

const PAD = 46;
const W = 640 + PAD * 2, H = 210 + PAD * 2;
const OUTER = { x: PAD, y: PAD, w: 640 - 32, h: 210 - 32, rx: 20 };
const INNER = { x: OUTER.x + 10, y: OUTER.y + 10, w: OUTER.w - 20, h: OUTER.h - 20, rx: 13 };

function rr({ x, y, w, h, rx }) {
  return `M${x + rx},${y} H${x + w - rx} Q${x + w},${y} ${x + w},${y + rx} V${y + h - rx} Q${x + w},${y + h} ${x + w - rx},${y + h} H${x + rx} Q${x},${y + h} ${x},${y + h - rx} V${y + rx} Q${x},${y} ${x + rx},${y} Z`;
}

function cornerOrnaments(style, r) {
  const pts = [
    [OUTER.x + 4, OUTER.y + 4, 1, 1],
    [OUTER.x + OUTER.w - 4, OUTER.y + 4, -1, 1],
    [OUTER.x + 4, OUTER.y + OUTER.h - 4, 1, -1],
    [OUTER.x + OUTER.w - 4, OUTER.y + OUTER.h - 4, -1, -1],
  ];
  return pts.map(([cx, cy, sx, sy]) => {
    if (style === "diamond") {
      return `<g transform="translate(${cx},${cy})">
        <path d="M0,${-9 * sy} L${5 * sx},0 L0,${9 * sy} L${-5 * sx},0 Z" fill="url(#metal-${r})" stroke="${"var(--dark)"}" stroke-width="0.6"/>
        <circle r="2.1" fill="#fff" opacity="0.85"/>
      </g>`;
    }
    if (style === "bracket") {
      return `<path d="M${cx},${cy + 16 * sy} L${cx},${cy} L${cx + 16 * sx},${cy}" fill="none" stroke="url(#metal-${r})" stroke-width="3" stroke-linecap="round"/>`;
    }
    if (style === "notch") {
      return `<path d="M${cx},${cy + 11 * sy} L${cx},${cy} L${cx + 11 * sx},${cy}" fill="none" stroke="var(--main)" stroke-width="2" stroke-linecap="round" opacity="0.9"/>`;
    }
    // tick
    return `<path d="M${cx},${cy + 7 * sy} L${cx},${cy} L${cx + 7 * sx},${cy}" fill="none" stroke="var(--main)" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>`;
  }).join("\n");
}

function particles(n) {
  if (!n) return "";
  const spots = [
    [OUTER.x + 54, OUTER.y + 24], [OUTER.x + OUTER.w - 54, OUTER.y + 24],
    [OUTER.x + 54, OUTER.y + OUTER.h - 24], [OUTER.x + OUTER.w - 54, OUTER.y + OUTER.h - 24],
    [W / 2 - 120, OUTER.y + 14], [W / 2 + 120, OUTER.y + OUTER.h - 14],
  ].slice(0, n);
  return spots.map(([x, y], i) => `
    <circle cx="${x}" cy="${y}" r="${1.6 + (i % 2)}" fill="var(--light)" opacity="0.8">
      <animate attributeName="opacity" values="0.25;0.9;0.25" dur="${2.4 + i * 0.3}s" repeatCount="indefinite"/>
    </circle>`).join("");
}

function topAccent(hasAccent, r) {
  if (!hasAccent) return "";
  const cx = W / 2, y = OUTER.y - 1;
  return `<g transform="translate(${cx},${y})">
    <path d="M-16,10 L0,-8 L16,10 L0,3 Z" fill="url(#metal-${r})" stroke="var(--dark)" stroke-width="0.8"/>
    <circle cy="-8" r="2.4" fill="var(--light)"/>
  </g>`;
}

const FONT_SIZE = 32;

function svgFor(rank) {
  const t = TIER[rank.tier];
  const r = rank.id;
  const fontSize = FONT_SIZE;
  const maxTextW = INNER.w - 64;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <style>
    @font-face {
      font-family: 'PixelRank';
      src: url(data:font/ttf;base64,${FONT_B64}) format('truetype');
      font-weight: 700;
    }
    :root {
      --main: ${rank.main};
      --light: ${rank.light};
      --dark: ${rank.dark};
      --glow: ${rank.glow};
    }
  </style>

  <linearGradient id="metal-${r}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${rank.light}"/>
    <stop offset="35%" stop-color="${rank.main}"/>
    <stop offset="60%" stop-color="${rank.dark}"/>
    <stop offset="100%" stop-color="${rank.dual || rank.main}"/>
  </linearGradient>

  <linearGradient id="panel-${r}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0d0d10" stop-opacity="0.95"/>
    <stop offset="100%" stop-color="${rank.dark}" stop-opacity="0.4"/>
  </linearGradient>

  <linearGradient id="sheen-${r}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${rank.light}" stop-opacity="0"/>
    <stop offset="45%" stop-color="${rank.light}" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="${rank.light}" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="${rank.light}" stop-opacity="0"/>
  </linearGradient>

  <radialGradient id="textglow-${r}" cx="50%" cy="50%" r="55%">
    <stop offset="0%" stop-color="${rank.glow}" stop-opacity="0.32"/>
    <stop offset="55%" stop-color="${rank.glow}" stop-opacity="0.09"/>
    <stop offset="100%" stop-color="${rank.glow}" stop-opacity="0"/>
  </radialGradient>

  <filter id="blur-${r}" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="${t.glowBlur}"/>
  </filter>
  <filter id="softblur-${r}" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>

<!-- outer glow -->
<path d="${rr(OUTER)}" fill="none" stroke="${rank.glow}" stroke-width="${t.glowWidth}" opacity="0.55" filter="url(#blur-${r})"/>
<path d="${rr(OUTER)}" fill="none" stroke="${rank.main}" stroke-width="${t.glowWidth * 0.5}" opacity="0.5" filter="url(#blur-${r})"/>

<!-- background panel -->
<path d="${rr(OUTER)}" fill="url(#panel-${r})"/>

${dualToneOverlay(rank, r)}

<!-- outer border -->
<path d="${rr(OUTER)}" fill="none" stroke="url(#metal-${r})" stroke-width="${t.borderW}"/>
<path d="${rr(OUTER)}" fill="none" stroke="${rank.dark}" stroke-width="${t.borderW * 0.4}" opacity="0.5"/>

<!-- inner border -->
<path d="${rr(INNER)}" fill="none" stroke="${rank.light}" stroke-width="${t.innerW}" opacity="0.55"/>

${t.sheen ? `<clipPath id="clip-${r}"><path d="${rr(INNER)}"/></clipPath>
<rect x="${INNER.x}" y="${INNER.y}" width="${INNER.w}" height="${INNER.h}" fill="url(#sheen-${r})" clip-path="url(#clip-${r})" opacity="0.35"/>` : ""}

${cornerOrnaments(t.corner, r)}
${topAccent(t.accent, r)}
${particles(t.particles)}
${rank.hazard ? hazardTicks(rank, r) : ""}

<!-- text glow halo -->
<ellipse cx="${W / 2}" cy="${H / 2}" rx="${maxTextW / 2 + 10}" ry="18" fill="url(#textglow-${r})" filter="url(#softblur-${r})"/>

<!-- rank name -->
<text x="${W / 2}" y="${H / 2}" text-anchor="middle" dominant-baseline="central"
      font-family="'PixelRank', monospace" font-weight="700" font-size="${fontSize}"
      textLength="${Math.min(maxTextW, rank.name.length * fontSize * 0.62)}" lengthAdjust="spacingAndGlyphs"
      fill="${rank.dark}" opacity="0.9" transform="translate(0,3)">${rank.name}</text>
<text x="${W / 2}" y="${H / 2}" text-anchor="middle" dominant-baseline="central"
      font-family="'PixelRank', monospace" font-weight="700" font-size="${fontSize}"
      textLength="${Math.min(maxTextW, rank.name.length * fontSize * 0.62)}" lengthAdjust="spacingAndGlyphs"
      fill="none" stroke="#050505" stroke-width="6" stroke-linejoin="round" paint-order="stroke">${rank.name}</text>
<text x="${W / 2}" y="${H / 2}" text-anchor="middle" dominant-baseline="central"
      font-family="'PixelRank', monospace" font-weight="700" font-size="${fontSize}"
      textLength="${Math.min(maxTextW, rank.name.length * fontSize * 0.62)}" lengthAdjust="spacingAndGlyphs"
      fill="url(#metal-${r})" stroke="${rank.dark}" stroke-width="1">${rank.name}</text>
<text x="${W / 2}" y="${H / 2 - 1}" text-anchor="middle" dominant-baseline="central"
      font-family="'PixelRank', monospace" font-weight="700" font-size="${fontSize}"
      textLength="${Math.min(maxTextW, rank.name.length * fontSize * 0.62)}" lengthAdjust="spacingAndGlyphs"
      fill="#ffffff" opacity="0.9">${rank.name}</text>
</svg>`;
}

function hazardTicks(rank, r) {
  const y1 = OUTER.y + OUTER.h - 6;
  const n = 10, span = OUTER.w - 40;
  let marks = "";
  for (let i = 0; i < n; i++) {
    const x = OUTER.x + 20 + (span / n) * i;
    marks += `<path d="M${x},${y1} l7,-12 h6 l-7,12 Z" fill="${i % 2 === 0 ? rank.main : rank.dual}" opacity="0.85"/>`;
  }
  return `<g clip-path="url(#hazardclip-${r})">${marks}</g><clipPath id="hazardclip-${r}"><path d="${rr(OUTER)}"/></clipPath>`;
}

function dualToneOverlay(rank, r) {
  if (!rank.dual) return "";
  return `<linearGradient id="dual-${r}" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0%" stop-color="${rank.main}" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="${rank.dual}" stop-opacity="0.22"/>
  </linearGradient>
  <path d="${rr(OUTER)}" fill="url(#dual-${r})"/>`;
}

// ---- write files -------------------------------------------------------

const outDir = new URL("../../public/ranks/svg/", import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

for (const rank of RANKS) {
  const svg = svgFor(rank);
  writeFileSync(path.join(outDir, `${rank.id}.svg`), svg, "utf8");
}

console.log(`Generated ${RANKS.length} badges into ${outDir}`);
