"use client";

import React, { useEffect, useRef, useState } from "react";

type PointerPos = { x: number; y: number; active: boolean };

/**
 * Interactive harmonic waveform preview for Sound Lab.
 * Pointer X shifts harmonic frequency; pointer Y modulates amplitude.
 */
export function SoundLabPreview({ pointer }: { pointer: PointerPos }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerPos>(pointer);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const p = pointerRef.current;

      t += p.active ? 0.045 : 0.02;

      ctx.clearRect(0, 0, w, h);

      // Subtle horizontal studio grid lines
      ctx.strokeStyle = "rgba(90, 209, 200, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const freq = p.active ? 1.5 + p.x * 4.5 : 2.6;
      const amp = p.active ? (0.22 + (1 - p.y) * 0.24) * h : 0.26 * h;

      // Subtle spectrum bars behind the wave
      const bars = 24;
      const barW = w / bars;
      for (let i = 0; i < bars; i++) {
        const norm = i / (bars - 1);
        const envelope = Math.sin(norm * Math.PI);
        const val =
          Math.abs(Math.sin(norm * freq * 3 + t * 1.1) * Math.cos(norm * 5 - t * 0.7)) *
          envelope;
        const barH = Math.max(3, val * amp * 1.5);
        ctx.fillStyle = `rgba(90, 209, 200, ${0.09 + val * 0.14})`;
        ctx.fillRect(i * barW + barW * 0.28, h / 2 - barH / 2, barW * 0.44, barH);
      }

      // Three layered harmonic waves
      const layers = [
        { mult: 1, phase: 0, color: "#5ad1c8", width: 2, alpha: 0.95 },
        { mult: 1.5, phase: 1.1, color: "#f2b872", width: 1.4, alpha: 0.75 },
        { mult: 2.2, phase: 2.3, color: "#5ad1c8", width: 1, alpha: 0.35 },
      ];

      layers.forEach((layer) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.globalAlpha = layer.alpha;
        ctx.lineWidth = layer.width;
        for (let x = 0; x <= w; x += 3) {
          const nx = x / w;
          const env = Math.sin(nx * Math.PI);
          const y =
            h / 2 +
            Math.sin(nx * Math.PI * 2 * freq * layer.mult + t + layer.phase) *
              amp *
              env *
              (1 / Math.sqrt(layer.mult));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0f16]">
      <canvas ref={canvasRef} className="h-full w-full block" />
      <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#5ad1c8]/75">
        <span>{pointer.active ? `${Math.round(220 + pointer.x * 660)} Hz` : "440 Hz"}</span>
        <span className="opacity-40">·</span>
        <span>SINE + HARMONICS</span>
      </div>
    </div>
  );
}

/**
 * Interactive playing card tableau preview for FreeCell.
 * Cards fan out smoothly on hover, and clicking the preview shuffles the mini hand.
 */
const SUITS = [
  { rank: "A", suit: "♠", red: false },
  { rank: "K", suit: "♥", red: true },
  { rank: "Q", suit: "♣", red: false },
  { rank: "J", suit: "♦", red: true },
];

export function FreeCellPreview({ pointer }: { pointer: PointerPos }) {
  const [shift, setShift] = useState(0);
  const cards = SUITS.map((_, idx) => SUITS[(idx + shift) % SUITS.length]);

  const spread = pointer.active ? 1 : 0;
  const tilt = pointer.active ? (pointer.x - 0.5) * 14 : 0;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #185b4a 0%, #114336 62%, #0b2d24 100%)",
      }}
    >
      {/* Subtle free-cell slots in the background */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex justify-between opacity-25">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="h-5 w-4 rounded-[3px] border border-white/60"
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          {["♠", "♥", "♣", "♦"].map((symbol) => (
            <div
              key={symbol}
              className="flex h-5 w-4 items-center justify-center rounded-[3px] border border-white/60 text-[8px] text-white/80"
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      {/* Fanned playing cards */}
      <div
        className="relative mt-4 flex h-28 w-48 items-center justify-center"
        onMouseEnter={() => setShift((s) => (s + 1) % 4)}
      >
        {cards.map((card, i) => {
          const offset = i - 1.5;
          const x = offset * (22 + spread * 12);
          const y = Math.abs(offset) * (3 + spread * 2) - spread * 4;
          const rot = offset * (7 + spread * 5) + tilt * 0.4;
          return (
            <div
              key={`${card.rank}-${card.suit}`}
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                zIndex: i + 1,
              }}
              className="absolute flex h-24 w-[4.25rem] flex-col justify-between rounded-lg border border-black/15 bg-[#faf8f3] p-1.5 shadow-[0_10px_22px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out select-none"
            >
              <div
                className={`flex flex-col leading-none font-mono text-[11px] font-bold ${
                  card.red ? "text-[#c43235]" : "text-[#14171f]"
                }`}
              >
                <span>{card.rank}</span>
                <span className="text-[10px]">{card.suit}</span>
              </div>
              <div
                className={`self-center text-2xl leading-none ${
                  card.red ? "text-[#c43235]" : "text-[#14171f]"
                }`}
              >
                {card.suit}
              </div>
              <div
                className={`self-end rotate-180 leading-none font-mono text-[11px] font-bold ${
                  card.red ? "text-[#c43235]" : "text-[#14171f]"
                }`}
              >
                {card.rank}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[10px] tracking-wider text-emerald-100/60">
        52 CARDS · 4 FREE CELLS
      </div>
    </div>
  );
}

/**
 * Interactive Lissajous / parametric rose curve preview for Math Gallery.
 * Matches Math Gallery's #070910 canvas with #f2b872 amber and #5ad1c8 teal.
 */
export function MathGalleryPreview({ pointer }: { pointer: PointerPos }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<PointerPos>(pointer);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let phase = 0.6;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const p = pointerRef.current;

      phase += p.active ? 0.018 : 0.008;

      ctx.clearRect(0, 0, w, h);

      // Subtle coordinate crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 16);
      ctx.lineTo(w / 2, h - 16);
      ctx.moveTo(24, h / 2);
      ctx.lineTo(w - 24, h / 2);
      ctx.stroke();

      const a = p.active ? 2 + Math.round(p.x * 3) : 3;
      const b = p.active ? 2 + Math.round(p.y * 3) : 4;
      const rx = w * 0.34;
      const ry = h * 0.34;
      const cx = w / 2;
      const cy = h / 2;

      const grad = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
      grad.addColorStop(0, "#f2b872");
      grad.addColorStop(1, "#5ad1c8");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      const steps = 260;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const x = cx + Math.sin(a * theta + phase) * rx;
        const y = cy + Math.sin(b * theta) * ry;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Traveling luminous point along curve
      const dotTheta = phase * 1.4;
      const dx = cx + Math.sin(a * dotTheta + phase) * rx;
      const dy = cy + Math.sin(b * dotTheta) * ry;
      ctx.fillStyle = "#f2b872";
      ctx.beginPath();
      ctx.arc(dx, dy, 3.2, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const aVal = pointer.active ? 2 + Math.round(pointer.x * 3) : 3;
  const bVal = pointer.active ? 2 + Math.round(pointer.y * 3) : 4;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#070910]">
      <canvas ref={canvasRef} className="h-full w-full block" />
      <div className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[10px] tracking-wider text-[#f2b872]/75">
        sin({aVal}t + φ), sin({bVal}t)
      </div>
    </div>
  );
}
