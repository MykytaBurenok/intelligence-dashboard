"use client";

import { useEffect, useState } from "react";

type ThemeName = "default" | "sunset" | "light";

const themes: ThemeName[] = ["default", "sunset", "light"];

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") {
    return "default";
  }

  const savedTheme = window.localStorage.getItem("theme") as ThemeName | null;

  if (savedTheme && themes.includes(savedTheme)) {
    return savedTheme;
  }

  return "default";
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
      {themes.map((item) => {
        const active = theme === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setTheme(item)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
              active
                ? "bg-[var(--text)] text-[var(--bg)] shadow-[var(--shadow-glow)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)]"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
