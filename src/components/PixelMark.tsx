// Small badge-style logo mark: a solid accent-colored square with a blocky,
// pixel-grid "L" glyph — the same visual pattern as the reference badge
// (solid color tile + a single white pixel letter), just built from our own
// generative pixel-rect system instead of a bitmap image.
const GLYPH_ROWS = ["X....", "X....", "X....", "X....", "X....", "X....", "XXXXX"];

type Props = {
  size?: number;
  className?: string;
};

export default function PixelMark({ size = 36, className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-accent ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 5 7" width={size * 0.42} height={size * 0.58}>
        {GLYPH_ROWS.map((row, y) =>
          row
            .split("")
            .map((c, x) =>
              c === "X" ? (
                <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#050505" />
              ) : null
            )
        )}
      </svg>
    </span>
  );
}
