"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { usePreferences } from "./PreferencesProvider";

export function BrandMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        className="fill-surface-elevated stroke-line"
        strokeWidth="1.2"
      />
      <path
        d="M8.5 22.5L16 8.5L23.5 22.5"
        fill="none"
        stroke="var(--accent-amber)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.5C11.9 14.9 13.9 17.1 16 18.4C18.1 17.1 20.1 14.9 22 11.5"
        fill="none"
        stroke="var(--accent-teal)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="18.4"
        x2="16"
        y2="24.5"
        stroke="var(--accent-teal)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggleTheme, lang, toggleLang, t } = usePreferences();

  return (
    <header
      data-sound-divider="bottom"
      className="sticky top-0 z-40 w-full bg-surface/65 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-sm font-medium tracking-tight text-ink transition-opacity hover:opacity-85"
        >
          <BrandMark className="w-7 h-7 transition-transform duration-300 group-hover:scale-105" />
          <span className="hidden xs:inline sm:inline">Yuri Araujo</span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Primary">
          <a
            href="#projects"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {t.nav.projects}
          </a>
          <a
            href="#about"
            className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {t.nav.about}
          </a>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLang}
            title={t.nav.toggleLang}
            aria-label={t.nav.toggleLang}
            className="flex h-8 items-center justify-center rounded-lg border border-line bg-surface-elevated px-2.5 font-mono text-xs font-medium uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
          >
            {lang}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            title={t.nav.toggleTheme}
            aria-label={t.nav.toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-elevated text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
