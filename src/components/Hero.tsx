"use client";

import React from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { usePreferences } from "./PreferencesProvider";

export default function Hero() {
  const { t } = usePreferences();

  return (
    <section
      id="top"
      className="relative flex min-h-[76vh] items-center py-16 sm:py-24"
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-[12%] -z-10 h-96 w-[38rem] rounded-full opacity-20 blur-3xl dark:opacity-15"
        style={{
          background:
            "radial-gradient(circle at 35% 50%, var(--accent-teal), transparent 60%), radial-gradient(circle at 70% 50%, var(--accent-amber), transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-elevated/70 px-3 py-1 font-mono text-xs text-ink-muted backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-teal animate-pulse-soft" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            {t.hero.titleStart}
            <span className="font-serif text-[1.14em] font-normal italic text-accent-amber">
              {t.hero.titleAccent}
            </span>
            {t.hero.titleEnd}
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-[1.08rem]">
            {t.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface-elevated/80 px-4 py-2.5 text-sm font-medium text-ink backdrop-blur-sm transition-colors hover:border-ink-faint"
            >
              <span>{t.hero.ctaProjects}</span>
              <ArrowDown className="h-3.5 w-3.5 text-ink-muted" />
            </a>

            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <a
                href="https://github.com/yuri-araujo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
              >
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="text-ink-faint">/</span>
              <a
                href="https://www.linkedin.com/in/yuriaraujodev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
              >
                LinkedIn
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
