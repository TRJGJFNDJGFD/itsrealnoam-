// Development-only font preview. Not mounted by the public site — import
// and render this directly (e.g. temporarily swap it in for <Home />) to
// check glyph coverage. Legend-IL uses one font (General Sans) for
// everything, so there is only a single sample to check.
const SAMPLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SAMPLE_LOWER = "abcdefghijklmnopqrstuvwxyz";
const SAMPLE_NUMS = "0123456789";
const SAMPLE_SYMS = "!@#$%^&*()";

export default function FontPreview() {
  return (
    <div className="min-h-screen space-y-4 bg-bg p-12 text-white-pure">
      <p className="mb-2 text-xs text-text-muted">MinecraftSeven / Silkscreen fallback</p>
      <p className="text-3xl">{SAMPLE}</p>
      <p className="text-3xl">{SAMPLE_LOWER}</p>
      <p className="text-3xl">{SAMPLE_NUMS}</p>
      <p className="text-3xl">{SAMPLE_SYMS}</p>
    </div>
  );
}
