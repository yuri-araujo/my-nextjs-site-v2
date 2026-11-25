"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "./PreferencesProvider";
import {
  FreeCellPreview,
  MathGalleryPreview,
  SoundLabPreview,
} from "./ProjectPreviews";

type ProjectId = "sound-lab" | "freecell" | "math-gallery";

function ProjectCard({
  id,
  title,
  tag,
  domain,
  url,
  description,
  openLabel,
}: {
  id: ProjectId;
  title: string;
  tag: string;
  domain: string;
  url: string;
  description: string;
  openLabel: string;
}) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: false });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      active: true,
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer((p) => ({ ...p, active: false }))}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-elevated/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ink-faint/60 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="relative h-48 w-full border-b border-line">
        {id === "sound-lab" && <SoundLabPreview pointer={pointer} />}
        {id === "freecell" && <FreeCellPreview pointer={pointer} />}
        {id === "math-gallery" && <MathGalleryPreview pointer={pointer} />}

        <span className="pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] font-medium text-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {openLabel}
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent-teal">
            {tag}
          </span>
        </div>

        <h3 className="mt-2 flex items-center justify-between text-lg font-semibold tracking-tight text-ink">
          <span>{title}</span>
          <ArrowUpRight className="h-4 w-4 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {description}
        </p>

        <div className="mt-4 pt-3 border-t border-line font-mono text-[11px] text-ink-faint transition-colors group-hover:text-ink-muted">
          {domain}
        </div>
      </div>
    </a>
  );
}

export default function ProjectsSection() {
  const { t } = usePreferences();

  return (
    <section
      id="projects"
      data-sound-divider="full"
      className="scroll-mt-20 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-amber">
              {t.projects.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t.projects.heading}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted">
            {t.projects.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.projects.items.map((item) => (
            <ProjectCard
              key={item.id}
              id={item.id as ProjectId}
              title={item.title}
              tag={item.tag}
              domain={item.domain}
              url={item.url}
              description={item.description}
              openLabel={t.projects.openLive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
