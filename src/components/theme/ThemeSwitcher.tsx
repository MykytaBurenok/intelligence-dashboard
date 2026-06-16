'use client';

import { useEffect, useSyncExternalStore } from 'react';

const themes = ['default', 'sunset'] as const;
type Theme = (typeof themes)[number];
const defaultTheme: Theme = 'default';
const themeStorageKey = 'theme';
const themeChangeEvent = 'theme-change';

function isTheme(value: string | null): value is Theme {
  return value !== null && themes.includes(value as Theme);
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return isTheme(savedTheme) ? savedTheme : defaultTheme;
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(themeChangeEvent, callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
}

function setStoredTheme(theme: Theme) {
  applyTheme(theme);
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export default function ThemeSwitcher() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    () => defaultTheme,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
      {themes.map((item) => {
        const active = theme === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setStoredTheme(item)}
            aria-pressed={active}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition',
              active
                ? 'bg-[var(--surface-strong)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]',
            ].join(' ')}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
