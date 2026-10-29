"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileNavigation({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] md:hidden"
      >
        {open ? <X size={15} /> : <Menu size={15} />}
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          id="mobile-navigation-panel"
          className="fixed inset-x-0 bottom-0 top-[62px] z-40 overflow-y-auto border-t border-[var(--border)] bg-[var(--bg)]/95 p-4 backdrop-blur-2xl md:hidden"
        >
          <div className="mx-auto max-w-xl" onClick={() => setOpen(false)}>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
