"use client";

import { useState } from "react";

type ShareButtonProps = {
  title: string;
  url?: string;
};

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}
