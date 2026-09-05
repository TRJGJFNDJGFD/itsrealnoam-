// Thin animated seam used between sections instead of a flat border — a
// slow shimmer travels along it so the page reads as one connected strip
// rather than a stack of separate blocks. Purely decorative.
export default function SectionSeam() {
  return (
    <div className="relative h-px w-full overflow-hidden bg-border" aria-hidden="true">
      <div className="seam-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
    </div>
  );
}
