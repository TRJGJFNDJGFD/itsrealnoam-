import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

type Props = {
  variant?: "default" | "compact";
  className?: string;
};

export default function CopyIP({ variant = "default", className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.ip);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleCopy}
        className="focus-ring group inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
      >
        <span className="font-mono">{SITE_CONFIG.ip}</span>
        {copied ? (
          <Check size={14} className="text-accent" />
        ) : (
          <Copy size={14} className="text-text-muted group-hover:text-accent" />
        )}
      </button>
    );
  }

  return (
    <div
      className={`focus-ring group flex items-center justify-between gap-4 rounded-sm border border-border bg-surface/80 px-5 py-3.5 backdrop-blur-sm transition-colors hover:border-accent/40 ${className}`}
    >
      <span className="font-mono text-sm text-text-primary sm:text-base">{SITE_CONFIG.ip}</span>
      <button
        onClick={handleCopy}
        aria-label="Copy server IP"
        className="focus-ring flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-secondary transition-colors hover:text-accent"
      >
        {copied ? (
          <>
            <Check size={14} className="text-accent" />
            <span className="text-accent">COPIED</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            COPY
          </>
        )}
      </button>
    </div>
  );
}
