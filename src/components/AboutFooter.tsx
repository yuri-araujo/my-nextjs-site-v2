"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "./PreferencesProvider";
import { BrandMark } from "./Navbar";

const LINKS = [
  {
    label: "GitHub",
    handle: "@yuri-araujo",
    href: "https://github.com/yuri-araujo",
  },
  {
    label: "LinkedIn",
    handle: "in/yuriaraujodev",
    href: "https://www.linkedin.com/in/yuriaraujodev/",
  },
];

export default function AboutFooter() {
  const { t } = usePreferences();

  return (
    <footer
      id="about"
      data-sound-divider="full"
      className="scroll-mt-20 pt-16 pb-20 sm:pb-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-teal">
              {t.about.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl italic tracking-tight text-ink sm:text-4xl">
              {t.about.heading}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
              {t.about.body}
            </p>
          </div>

          <div className="flex flex-col justify-end md:col-span-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              {t.about.connect}
            </p>
            <div className="flex flex-col gap-2.5">
              {LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-line bg-surface-elevated/80 px-4 py-3 backdrop-blur-md transition-all hover:border-ink-faint"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-medium text-ink">{item.label}</span>
                    <span className="font-mono text-xs text-ink-faint">
                      {item.handle}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          data-sound-divider="inset"
          className="mt-14 flex flex-col items-start justify-between gap-4 pt-6 text-xs text-ink-faint sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-5 w-5" />
            <span>© {new Date().getFullYear()} Yuri Araujo</span>
          </div>
          <span className="font-mono text-[11px]">{t.about.shortcuts}</span>
        </div>
      </div>
    </footer>
  );
}
