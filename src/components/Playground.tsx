"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioWaveform,
  Eye,
  EyeOff,
  GitBranch,
  Orbit,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { usePreferences } from "./PreferencesProvider";

type LayerId = "flow" | "dragon" | "sound";
type ForceMode = "orbit" | "attract" | "repel";
type ScaleKey = "pentatonic" | "lydian" | "minor";
type WaveType = "sine" | "triangle" | "sawtooth";

type NoteDef = { name: string; freq: number };

const SCALES: Record<ScaleKey, NoteDef[]> = {
  pentatonic: [
    { name: "C4", freq: 261.63 },
    { name: "D4", freq: 293.66 },
    { name: "E4", freq: 329.63 },
    { name: "G4", freq: 392.0 },
    { name: "A4", freq: 440.0 },
    { name: "C5", freq: 523.25 },
    { name: "D5", freq: 587.33 },
    { name: "E5", freq: 659.25 },
    { name: "G5", freq: 783.99 },
    { name: "A5", freq: 880.0 },
  ],
  lydian: [
    { name: "F3", freq: 174.61 },
    { name: "G3", freq: 196.0 },
    { name: "A3", freq: 220.0 },
    { name: "B3", freq: 246.94 },
    { name: "C4", freq: 261.63 },
    { name: "D4", freq: 293.66 },
    { name: "E4", freq: 329.63 },
    { name: "F4", freq: 349.23 },
    { name: "G4", freq: 392.0 },
    { name: "A4", freq: 440.0 },
  ],
  minor: [
    { name: "A3", freq: 220.0 },
    { name: "C4", freq: 261.63 },
    { name: "D4", freq: 293.66 },
    { name: "E4", freq: 329.63 },
    { name: "G4", freq: 392.0 },
    { name: "A4", freq: 440.0 },
    { name: "C5", freq: 523.25 },
    { name: "D5", freq: 587.33 },
    { name: "E5", freq: 659.25 },
    { name: "G5", freq: 783.99 },
  ],
};

// Pure 2D crystallographic lattice angles (60°, 90°, 120°) stay razor-sharp with zero off-grid tangling
const DRAGON_PRESETS = [
  { folds: 10, angle: 90 }, // Classic Heighway (square lattice)
  { folds: 9, angle: 60 }, // Hexagonal Wave (hexagonal lattice, 0 overlaps)
  { folds: 9, angle: 120 }, // Triangular Crystal (triangular lattice)
  { folds: 6, angle: 90 }, // Origami Skeleton (bold 64 segments)
  { folds: 12, angle: 90 }, // Fine Heighway Filigree (4,096 segments)
] as const;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hueMix: number;
  speed: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  label: string;
};

type DragonPulse = {
  origin: number;
  dist: number;
  speed: number;
  alpha: number;
};

type DividerStringState = {
  pluckX: number;
  disp: number;
  vel: number;
  glow: number;
  lastStrumAt: number;
};

type OrbPhase = "free" | "orbiting" | "released";

type Orb = {
  x: number;
  y: number; // document-space Y so orbiting moons stay locked to the hero fractal on scroll
  vx: number;
  vy: number;
  radius: number;
  amber: boolean;
  phase: OrbPhase;
  age: number;
  orbitAngle: number;
  sweptRad: number;
  trail: { x: number; y: number }[];
  spark: number;
  prevDr: number;
  lastChimeAt: number;
  hasShiftedDragon: boolean;
};

type AudioEngine = {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
};

const MAX_DRAGON_FOLDS = 12;
const MAX_VERTS = (1 << MAX_DRAGON_FOLDS) + 1;

function buildDragonTurns(iterations: number): Int8Array {
  let turns = new Int8Array(0);
  for (let i = 0; i < iterations; i++) {
    const next = new Int8Array(turns.length * 2 + 1);
    next.set(turns, 0);
    next[turns.length] = 1;
    for (let j = 0; j < turns.length; j++) {
      next[turns.length + 1 + j] = -turns[turns.length - 1 - j];
    }
    turns = next;
  }
  return turns;
}

const DRAGON_TURNS = buildDragonTurns(MAX_DRAGON_FOLDS);
const DRAGON_XS = new Float32Array(MAX_VERTS);
const DRAGON_YS = new Float32Array(MAX_VERTS);

// Per-vertex spring physics buffers (zero allocation during animation)
const SPRING_DX = new Float32Array(MAX_VERTS);
const SPRING_DY = new Float32Array(MAX_VERTS);
const SPRING_VX = new Float32Array(MAX_VERTS);
const SPRING_VY = new Float32Array(MAX_VERTS);
const FINAL_XS = new Float32Array(MAX_VERTS);
const FINAL_YS = new Float32Array(MAX_VERTS);

function evaluateDragon(
  continuousFolds: number,
  angleDeg: number
): { count: number; minX: number; maxX: number; minY: number; maxY: number } {
  const f = Math.max(1, Math.min(MAX_DRAGON_FOLDS - 0.001, continuousFolds));
  const k = Math.floor(f);
  const frac = f - k;
  const rad = (Math.max(0, Math.min(180, angleDeg)) * Math.PI) / 180;

  const useFractional = frac > 0.001;
  const count = useFractional ? 1 << (k + 1) : 1 << k;
  const turnCount = count - 1;

  let dir = -f * rad * 0.5;
  let cx = 0;
  let cy = 0;
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  DRAGON_XS[0] = 0;
  DRAGON_YS[0] = 0;

  for (let i = 0; i < count; i++) {
    cx += Math.cos(dir);
    cy += Math.sin(dir);
    DRAGON_XS[i + 1] = cx;
    DRAGON_YS[i + 1] = cy;
    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;

    if (i < turnCount) {
      const turn = DRAGON_TURNS[i];
      if (useFractional && (i & 1) === 0) {
        dir += turn * rad * frac;
      } else {
        dir += turn * rad;
      }
    }
  }

  return { count, minX, maxX, minY, maxY };
}

const INTERACTIVE_UI_SELECTOR =
  "a, button, input, select, textarea, label, [data-ui-control]";
const SELECTABLE_TEXT_SELECTOR =
  "h1, h2, h3, h4, p, li, code, pre, blockquote";
const MAX_THROWN_ORBS = 14;
const ORBITS_BEFORE_EJECT = 3;
const EJECT_SWEEP_RAD = Math.PI * 2 * ORBITS_BEFORE_EJECT;
const THROW_DRAG_THRESHOLD = 16;
const GRAVITY_G = 1150;
const GRAVITY_SOFTENING = 900;
const GRAVITY_INFLUENCE_RADIUS = 290;
const GRAVITY_CAPTURE_RADIUS = 185;

export default function Playground() {
  const { theme, t } = usePreferences();

  const flowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vectorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  // Layer toggles
  const [flowOn, setFlowOn] = useState(true);
  const [dragonOn, setDragonOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const [openPanel, setOpenPanel] = useState<LayerId | null>(null);

  // Flow controls
  const [forceMode, setForceMode] = useState<ForceMode>("orbit");
  const [longTrails, setLongTrails] = useState(true);
  const [flowSeed, setFlowSeed] = useState(1);

  // Dragon controls
  const [folds, setFolds] = useState(10);
  const [angle, setAngle] = useState(90);
  const [morphing, setMorphing] = useState(false);

  // Sound controls
  const [scale, setScale] = useState<ScaleKey>("pentatonic");
  const [wave, setWave] = useState<WaveType>("triangle");
  const [lastNote, setLastNote] = useState<string>("");

  const stateRef = useRef({
    theme,
    flowOn,
    dragonOn,
    soundOn,
    openPanel,
    forceMode,
    longTrails,
    flowSeed,
    folds,
    angle,
    morphing,
    scale,
    wave,
  });

  useEffect(() => {
    stateRef.current = {
      theme,
      flowOn,
      dragonOn,
      soundOn,
      openPanel,
      forceMode,
      longTrails,
      flowSeed,
      folds,
      angle,
      morphing,
      scale,
      wave,
    };
  }, [
    theme,
    flowOn,
    dragonOn,
    soundOn,
    openPanel,
    forceMode,
    longTrails,
    flowSeed,
    folds,
    angle,
    morphing,
    scale,
    wave,
  ]);

  const pointerRef = useRef({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    active: false,
    down: false,
    downX: 0,
    downY: 0,
    isThrowing: false,
  });

  const engineRef = useRef<AudioEngine | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const pulsesRef = useRef<DragonPulse[]>([]);
  const orbsRef = useRef<Orb[]>([]);
  const orbColorToggleRef = useRef(false);
  const dragonPresetIdxRef = useRef(0);
  const heroCenterRef = useRef({ x: 800, y: 400 });
  const dragonLastCountRef = useRef(0);
  const dividerStatesRef = useRef<WeakMap<HTMLElement, DividerStringState>>(
    new WeakMap()
  );
  const lastAudioAtRef = useRef<number>(0);

  const ensureAudio = useCallback((): AudioEngine | null => {
    if (typeof window === "undefined") return null;
    if (!engineRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = 0.24;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.86;

      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.25;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.26;
      const wetFilter = ctx.createBiquadFilter();
      wetFilter.type = "lowpass";
      wetFilter.frequency.value = 2100;

      master.connect(analyser);
      master.connect(delay);
      delay.connect(wetFilter);
      wetFilter.connect(feedback);
      feedback.connect(delay);
      wetFilter.connect(analyser);
      analyser.connect(ctx.destination);

      engineRef.current = { ctx, master, analyser };
    }
    if (engineRef.current.ctx.state === "suspended") {
      engineRef.current.ctx.resume().catch(() => {});
    }
    return engineRef.current;
  }, []);

  const playNote = useCallback(
    (
      normX: number,
      normY: number,
      opts?: {
        gain?: number;
        duration?: number;
        unlockIfNeeded?: boolean;
        rippleAt?: { x: number; y: number; hideLabel?: boolean };
      }
    ) => {
      if (!stateRef.current.soundOn) return;
      const unlock = opts?.unlockIfNeeded ?? true;
      const engine = unlock ? ensureAudio() : engineRef.current;
      if (!engine || engine.ctx.state !== "running") {
        if (!unlock) return;
        if (!engine) return;
      }

      const nx = Math.max(0, Math.min(0.999, normX));
      const ny = Math.max(0, Math.min(0.999, normY));
      const notes = SCALES[stateRef.current.scale];
      const note = notes[Math.floor(nx * notes.length)];

      const { ctx, master } = engine;
      const now = ctx.currentTime;
      const peakGain = opts?.gain ?? 0.36;
      const dur = opts?.duration ?? 1.2;

      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc.type = stateRef.current.wave;
      osc.frequency.setValueAtTime(note.freq, now);

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(note.freq * 2, now);
      subOsc.detune.setValueAtTime(4, now);

      const subGain = ctx.createGain();
      subGain.gain.value = 0.14;

      const brightness = Math.max(0.08, Math.min(1, 1 - ny));
      const cutoff = 340 + Math.pow(brightness, 2) * 4400;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(cutoff, now);
      filter.Q.setValueAtTime(1.5 + brightness * 2.0, now);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(peakGain, now + 0.018);
      env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      subOsc.connect(subGain);
      subGain.connect(filter);
      filter.connect(env);
      env.connect(master);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + dur + 0.05);
      subOsc.stop(now + dur + 0.05);

      lastAudioAtRef.current = performance.now();
      setLastNote(note.name);

      if (opts?.rippleAt) {
        const isDark = stateRef.current.theme === "dark";
        const useAmber = nx > 0.5;
        const color = isDark
          ? useAmber
            ? "#f2b872"
            : "#5ad1c8"
          : useAmber
            ? "#c27824"
            : "#0e8a80";

        ripplesRef.current.push({
          x: opts.rippleAt.x,
          y: opts.rippleAt.y,
          radius: 8,
          maxRadius: 85 + brightness * 70,
          alpha: 0.78,
          color,
          label: opts.rippleAt.hideLabel ? "" : note.name,
        });
      }
    },
    [ensureAudio]
  );

  const shiftDragonConfiguration = useCallback(() => {
    let nextIdx = (dragonPresetIdxRef.current + 1) % DRAGON_PRESETS.length;
    if (
      DRAGON_PRESETS[nextIdx].folds === stateRef.current.folds &&
      DRAGON_PRESETS[nextIdx].angle === stateRef.current.angle
    ) {
      nextIdx = (nextIdx + 1) % DRAGON_PRESETS.length;
    }
    dragonPresetIdxRef.current = nextIdx;
    const preset = DRAGON_PRESETS[nextIdx];

    stateRef.current.folds = preset.folds;
    stateRef.current.angle = preset.angle;
    stateRef.current.morphing = false;
    setFolds(preset.folds);
    setAngle(preset.angle);
    setMorphing(false);
  }, []);

  const spawnOrb = useCallback(
    (
      x: number,
      docY: number,
      vx: number,
      vy: number,
      opts?: { startOrbiting?: boolean; amber?: boolean; radius?: number }
    ) => {
      orbColorToggleRef.current = !orbColorToggleRef.current;
      const startOrbiting = opts?.startOrbiting ?? false;
      const { x: wellX, y: wellY } = heroCenterRef.current;
      const orb: Orb = {
        x,
        y: docY,
        vx,
        vy,
        radius: opts?.radius ?? (startOrbiting ? 3.1 : 3.4),
        amber: opts?.amber ?? orbColorToggleRef.current,
        phase: startOrbiting ? "orbiting" : "free",
        age: 0,
        orbitAngle: Math.atan2(docY - wellY, x - wellX),
        sweptRad: 0,
        trail: [{ x, y: docY }],
        spark: 1,
        prevDr: 0,
        lastChimeAt: performance.now(),
        hasShiftedDragon: startOrbiting,
      };
      orbsRef.current.push(orb);

      if (orbsRef.current.length > MAX_THROWN_ORBS) {
        orbsRef.current.shift();
      }
    },
    []
  );

  const seedInitialMoons = useCallback(() => {
    const { x: cx, y: cy } = heroCenterRef.current;
    const r1 = 152;
    const v1 = Math.sqrt(GRAVITY_G / r1) * 0.96;
    const r2 = 218;
    const v2 = Math.sqrt(GRAVITY_G / r2) * 0.92;
    spawnOrb(cx + r1, cy - 18, 0.2, v1, {
      startOrbiting: true,
      amber: false,
      radius: 3.1,
    });
    spawnOrb(cx - r2 * 0.72, cy + r2 * 0.68, -v2 * 0.68, -v2 * 0.72, {
      startOrbiting: true,
      amber: true,
      radius: 2.9,
    });
  }, [spawnOrb]);

  const playChord = useCallback(() => {
    if (!stateRef.current.soundOn) setSoundOn(true);
    const vw = window.innerWidth || 1200;
    const vh = window.innerHeight || 800;
    const notes = SCALES[stateRef.current.scale];
    const indices = [0, 2, 4, 6];
    indices.forEach((idx, step) => {
      window.setTimeout(() => {
        const nx = (idx + 0.5) / notes.length;
        const ny = 0.28 + step * 0.13;
        stateRef.current.soundOn = true;
        playNote(nx, ny, {
          rippleAt: { x: nx * vw, y: ny * vh },
        });
      }, step * 115);
    });
  }, [playNote]);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.ctx.close().catch(() => {});
        engineRef.current = null;
      }
    };
  }, []);

  // Keyboard shortcuts (1-3 toggle layer popovers, Escape closes) & click-outside close
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "1")
        setOpenPanel((cur) => (cur === "flow" ? null : "flow"));
      if (event.key === "2")
        setOpenPanel((cur) => (cur === "dragon" ? null : "dragon"));
      if (event.key === "3")
        setOpenPanel((cur) => (cur === "sound" ? null : "sound"));
      if (event.key === "Escape") setOpenPanel(null);
    };

    const onDocPointerDown = (event: PointerEvent) => {
      if (
        dockRef.current &&
        event.target instanceof Node &&
        !dockRef.current.contains(event.target)
      ) {
        setOpenPanel(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onDocPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onDocPointerDown);
    };
  }, []);

  // Global pointer interactions: swipe-pluck section strings, brush dragon, tap note/pulse, drag & throw orbs
  useEffect(() => {
    const triggerDragonPulseNear = (docX: number, docY: number) => {
      if (!stateRef.current.dragonOn) return;
      const count = dragonLastCountRef.current;
      if (count <= 0) return;

      let bestIdx = -1;
      let bestDistSq = 175 * 175;
      const step = Math.max(1, Math.floor(count / 256));
      for (let i = 0; i <= count; i += step) {
        const dx = FINAL_XS[i] - docX;
        const dy = FINAL_YS[i] - docY;
        const dSq = dx * dx + dy * dy;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = i;
        }
      }
      if (bestIdx !== -1) {
        pulsesRef.current.push({
          origin: bestIdx,
          dist: 0,
          speed: Math.max(6, count * 0.022),
          alpha: 1,
        });
      }
    };

    const strumDividersCrossed = (
      x: number,
      prevY: number,
      y: number,
      vy: number,
      canUnlock: boolean
    ) => {
      if (Math.abs(vy) < 0.5) return;
      const els = document.querySelectorAll<HTMLElement>("[data-sound-divider]");
      const now = performance.now();
      const yMin = Math.min(prevY, y);
      const yMax = Math.max(prevY, y);

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const kind = el.dataset.soundDivider;
        const lineY = kind === "bottom" ? rect.bottom : rect.top;
        if (lineY < yMin || lineY > yMax) return;

        const isFull = kind === "full" || kind === "bottom";
        const x0 = isFull ? 0 : rect.left;
        const x1 = isFull ? window.innerWidth : rect.right;
        if (x < x0 || x > x1) return;

        let st = dividerStatesRef.current.get(el);
        if (!st) {
          st = { pluckX: 0.5, disp: 0, vel: 0, glow: 0, lastStrumAt: 0 };
          dividerStatesRef.current.set(el, st);
        }
        if (now - st.lastStrumAt < 140) return;

        const pluckNorm = Math.max(
          0.04,
          Math.min(0.96, (x - x0) / Math.max(1, x1 - x0))
        );
        const dirSign = vy >= 0 ? 1 : -1;
        const impulse = Math.max(8, Math.min(24, Math.abs(vy) * 0.8)) * dirSign;

        st.pluckX = pluckNorm;
        st.vel += impulse;
        st.glow = 1;
        st.lastStrumAt = now;

        playNote(
          pluckNorm,
          Math.max(0.1, Math.min(0.9, lineY / Math.max(1, window.innerHeight))),
          {
            gain: 0.28,
            duration: 1.05,
            unlockIfNeeded: canUnlock,
          }
        );
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      const ptr = pointerRef.current;
      const hadPrev = ptr.active;
      const prevX = hadPrev ? ptr.x : e.clientX;
      const prevY = hadPrev ? ptr.y : e.clientY;
      const vx = e.clientX - prevX;
      const vy = e.clientY - prevY;

      ptr.prevX = prevX;
      ptr.prevY = prevY;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.vx = vx;
      ptr.vy = vy;
      ptr.active = true;

      if (hadPrev) {
        strumDividersCrossed(e.clientX, prevY, e.clientY, vy, ptr.down);
      }

      if (ptr.down) {
        const dragDist = Math.hypot(
          e.clientX - ptr.downX,
          e.clientY - ptr.downY
        );
        if (dragDist >= THROW_DRAG_THRESHOLD) {
          ptr.isThrowing = true;
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest(INTERACTIVE_UI_SELECTOR)) return;

      const ptr = pointerRef.current;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.prevX = e.clientX;
      ptr.prevY = e.clientY;
      ptr.vx = 0;
      ptr.vy = 0;
      ptr.active = true;

      const onText = Boolean(target?.closest(SELECTABLE_TEXT_SELECTOR));
      if (!onText) {
        ptr.down = true;
        ptr.downX = e.clientX;
        ptr.downY = e.clientY;
        ptr.isThrowing = false;
        document.body.style.userSelect = "none";

        if (stateRef.current.soundOn) {
          ensureAudio();
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const ptr = pointerRef.current;
      if (!ptr.down) return;

      document.body.style.userSelect = "";
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      if (ptr.isThrowing) {
        // Throw an orb from the pull anchor along the slingshot vector
        const dx = ptr.downX - e.clientX;
        const dy = ptr.downY - e.clientY;
        let vx = dx * 0.085;
        let vy = dy * 0.085;
        const mag = Math.hypot(vx, vy);
        const minSpeed = 4.5;
        const maxSpeed = 16;
        if (mag > 0.01) {
          const clamped = Math.max(minSpeed, Math.min(maxSpeed, mag));
          vx = (vx / mag) * clamped;
          vy = (vy / mag) * clamped;
        }
        spawnOrb(ptr.downX, ptr.downY + window.scrollY, vx, vy, {
          startOrbiting: false,
        });
        playNote(ptr.downX / vw, ptr.downY / vh, {
          gain: 0.24,
          duration: 0.9,
          rippleAt: { x: ptr.downX, y: ptr.downY, hideLabel: true },
        });
      } else {
        playNote(e.clientX / vw, e.clientY / vh, {
          rippleAt: { x: e.clientX, y: e.clientY },
        });
        triggerDragonPulseNear(e.clientX, e.clientY + window.scrollY);
      }

      ptr.down = false;
      ptr.isThrowing = false;
    };

    const onPointerLeave = () => {
      if (pointerRef.current.down) {
        document.body.style.userSelect = "";
      }
      pointerRef.current.active = false;
      pointerRef.current.down = false;
      pointerRef.current.isThrowing = false;
      pointerRef.current.vx = 0;
      pointerRef.current.vy = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [ensureAudio, playNote, spawnOrb]);

  // Main animation loop: Flow + Elastic Dragon + Bouncing Thrown Orbs + Pluckable Section Strings
  useEffect(() => {
    const flowCanvas = flowCanvasRef.current;
    const vectorCanvas = vectorCanvasRef.current;
    const dragonCanvas = dragonCanvasRef.current;
    if (!flowCanvas || !vectorCanvas || !dragonCanvas) return;
    const flowCtx = flowCanvas.getContext("2d");
    const vecCtx = vectorCanvas.getContext("2d");
    const dragonCtx = dragonCanvas.getContext("2d");
    if (!flowCtx || !vecCtx || !dragonCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dragonW = width;
    let dragonH = height;
    let heroCenterY = height * 0.47;
    let particles: Particle[] = [];
    let timeData: Uint8Array<ArrayBuffer> | null = null;
    let lastSeed = stateRef.current.flowSeed;
    let lastTheme = stateRef.current.theme;

    const spawnParticles = () => {
      const area = width * height;
      const count = Math.max(130, Math.min(280, Math.round(area / 5200)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        hueMix: Math.random(),
        speed: 0.65 + Math.random() * 0.85,
      }));
    };

    const syncDragonBounds = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const heroEl = document.getElementById("top");
      dragonW = Math.max(1, window.innerWidth);
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const heroTop = rect.top + window.scrollY;
        const heroH = rect.height;
        dragonH = Math.max(window.innerHeight, Math.ceil(heroTop + heroH + 80));
        heroCenterY = heroTop + heroH * 0.5;
      } else {
        dragonH = Math.max(1, window.innerHeight);
        heroCenterY = dragonH * 0.47;
      }
      const isDesktop = dragonW >= 1024;
      heroCenterRef.current = {
        x: isDesktop ? dragonW * 0.72 : dragonW * 0.5,
        y: isDesktop ? heroCenterY : heroCenterY + 20,
      };
      dragonCanvas.style.height = `${dragonH}px`;
      dragonCanvas.width = Math.floor(dragonW * dpr);
      dragonCanvas.height = Math.floor(dragonH * dpr);
      dragonCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);

      flowCanvas.width = Math.floor(width * dpr);
      flowCanvas.height = Math.floor(height * dpr);
      flowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      vectorCanvas.width = Math.floor(width * dpr);
      vectorCanvas.height = Math.floor(height * dpr);
      vecCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncDragonBounds();
      spawnParticles();
    };

    resize();

    if (orbsRef.current.length === 0) {
      seedInitialMoons();
    }

    window.addEventListener("resize", resize);
    const heroElForObserve = document.getElementById("top");
    const heroObserver =
      heroElForObserve && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncDragonBounds)
        : null;
    if (heroElForObserve && heroObserver) {
      heroObserver.observe(heroElForObserve);
    }

    let raf = 0;
    let time = 0;
    let morphPhase = 0;
    let audioLevel = 0;
    let waveVisibility = 0;
    let smoothFolds = stateRef.current.folds;
    let smoothAngle = stateRef.current.angle;
    let smoothBrushVx = 0;
    let smoothBrushVy = 0;

    const getDividerEls = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-sound-divider]")
      );
    let dividerEls = getDividerEls();

    const tick = () => {
      const st = stateRef.current;
      const isDark = st.theme === "dark";
      const ptr = pointerRef.current;
      const scrollY = window.scrollY || 0;
      const nowMs = performance.now();
      time += 0.0045;

      // Smoothly filter brush velocity for silky fractal touch
      smoothBrushVx += (ptr.vx - smoothBrushVx) * 0.25;
      smoothBrushVy += (ptr.vy - smoothBrushVy) * 0.25;
      ptr.vx *= 0.72;
      ptr.vy *= 0.72;

      if (st.flowSeed !== lastSeed) {
        lastSeed = st.flowSeed;
        flowCtx.clearRect(0, 0, width, height);
        spawnParticles();
      }
      if (st.theme !== lastTheme) {
        lastTheme = st.theme;
        flowCtx.clearRect(0, 0, width, height);
      }

      // === LAYER 1: Seamless Transparent Flow Field ===
      if (st.flowOn) {
        const fade = st.longTrails ? 0.11 : 0.28;
        flowCtx.save();
        flowCtx.globalCompositeOperation = "destination-out";
        flowCtx.fillStyle = `rgba(0, 0, 0, ${fade})`;
        flowCtx.fillRect(0, 0, width, height);
        flowCtx.restore();

        const seed = st.flowSeed;
        const mode = st.forceMode;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const prevX = p.x;
          const prevY = p.y;

          const nx = (p.x / width) * 3.4 + seed * 1.7;
          const ny = (p.y / height) * 3.4 - seed * 1.1;
          const fieldAngle =
            Math.sin(nx + time) * Math.cos(ny - time * 0.8) * Math.PI * 2 +
            Math.cos((nx + ny) * 0.7 + time * 0.5) * 1.3;

          p.vx += Math.cos(fieldAngle) * 0.07 * p.speed;
          p.vy += Math.sin(fieldAngle) * 0.07 * p.speed;

          let nearCursor = 0;
          if (ptr.active) {
            const dx = ptr.x - p.x;
            const dy = ptr.y - p.y;
            const distSq = dx * dx + dy * dy + 140;
            const radius = ptr.down ? 250 : 160;
            if (distSq < radius * radius) {
              const dist = Math.sqrt(distSq);
              const falloff = 1 - dist / radius;
              nearCursor = falloff;
              const strength = (ptr.down ? 1.55 : 0.45) * falloff;
              const ux = dx / dist;
              const uy = dy / dist;

              if (mode === "attract") {
                p.vx += ux * strength;
                p.vy += uy * strength;
              } else if (mode === "repel") {
                p.vx -= ux * strength * 1.2;
                p.vy -= uy * strength * 1.2;
              } else {
                p.vx += (-uy * 1.15 + ux * 0.36) * strength;
                p.vy += (ux * 1.15 + uy * 0.36) * strength;
              }
            }
          }

          p.vx *= 0.93;
          p.vy *= 0.93;
          p.x += p.vx;
          p.y += p.vy;

          let wrapped = false;
          if (p.x < 0) {
            p.x = width;
            wrapped = true;
          } else if (p.x > width) {
            p.x = 0;
            wrapped = true;
          }
          if (p.y < 0) {
            p.y = height;
            wrapped = true;
          } else if (p.y > height) {
            p.y = 0;
            wrapped = true;
          }

          if (!wrapped) {
            const speedMag = Math.min(1, Math.hypot(p.vx, p.vy) / 3.4);
            const alpha = Math.min(
              0.72,
              (isDark ? 0.15 : 0.18) + speedMag * 0.3 + nearCursor * 0.32
            );
            flowCtx.strokeStyle =
              p.hueMix > 0.5
                ? isDark
                  ? `rgba(90, 209, 200, ${alpha})`
                  : `rgba(14, 138, 128, ${alpha})`
                : isDark
                  ? `rgba(242, 184, 114, ${alpha})`
                  : `rgba(194, 120, 36, ${alpha})`;
            flowCtx.lineWidth = 1.05 + speedMag * 0.75 + nearCursor * 0.55;
            flowCtx.beginPath();
            flowCtx.moveTo(prevX, prevY);
            flowCtx.lineTo(p.x, p.y);
            flowCtx.stroke();
          }
        }
      } else {
        flowCtx.clearRect(0, 0, width, height);
      }

      // === Compute live audio waveform & energy ===
      const engine = engineRef.current;
      const sinceAudio = nowMs - lastAudioAtRef.current;
      const audioActive = Boolean(engine && sinceAudio < 2500);
      let rms = 0;

      if (engine && st.soundOn) {
        if (!timeData || timeData.length !== engine.analyser.fftSize) {
          timeData = new Uint8Array(engine.analyser.fftSize);
        }
        engine.analyser.getByteTimeDomainData(timeData);
        let sumSq = 0;
        for (let i = 0; i < timeData.length; i += 4) {
          const v = (timeData[i] - 128) / 128;
          sumSq += v * v;
        }
        rms = Math.sqrt(sumSq / (timeData.length / 4));
      }
      audioLevel += (rms - audioLevel) * 0.16;
      const targetWaveVis = audioActive && st.soundOn ? 1 : 0;
      waveVisibility += (targetWaveVis - waveVisibility) * 0.08;

      if (dividerEls.length === 0) {
        dividerEls = getDividerEls();
      }

      // === LAYER 2 (Absolute Hero Canvas): Smooth Spring-Physics Dragon Curve ===
      const heroVisible = scrollY < dragonH + 140;
      const orbs = orbsRef.current;

      if (heroVisible && st.dragonOn) {
        dragonCtx.clearRect(0, 0, dragonW, dragonH);
        const isDesktop = dragonW >= 1024;
        const baseCx = heroCenterRef.current.x;
        const baseCy = heroCenterRef.current.y;
        const docPtrX = ptr.x;
        const docPtrY = ptr.y + scrollY;

        let targetAngle = st.angle;
        const targetFolds = st.folds;
        if (st.morphing) {
          morphPhase += 0.012;
          targetAngle = 90 + Math.sin(morphPhase) * 30;
        }

        smoothAngle += (targetAngle - smoothAngle) * 0.07;
        smoothFolds += (targetFolds - smoothFolds) * 0.07;

        const { count, minX, maxX, minY, maxY } = evaluateDragon(
          smoothFolds,
          smoothAngle
        );
        dragonLastCountRef.current = count;

        const spanX = Math.max(1, maxX - minX);
        const spanY = Math.max(1, maxY - minY);
        const targetW = isDesktop
          ? Math.min(dragonW * 0.44, 560)
          : Math.min(dragonW * 0.82, 400);
        const targetH = isDesktop
          ? Math.min(height * 0.56, 460)
          : Math.min(height * 0.42, 300);
        const scaleFit = Math.min(targetW / spanX, targetH / spanY);
        const midX = (minX + maxX) * 0.5;
        const midY = (minY + maxY) * 0.5;
        const offsetX = baseCx - midX * scaleFit;
        const offsetY = baseCy - midY * scaleFit;

        // Check thrown orb hits on the fractal: touching it shifts folds & angle!
        if (orbs.length > 0 && count > 0) {
          const sampleStep = Math.max(1, Math.floor(count / 240));
          for (let oIdx = 0; oIdx < orbs.length; oIdx++) {
            const orb = orbs[oIdx];
            if (orb.hasShiftedDragon) continue;

            const orbDocX = orb.x;
            const orbDocY = orb.y;
            let hitIdx = -1;
            let bestDistSq = 36 * 36;

            for (let i = 0; i <= count; i += sampleStep) {
              const bx = DRAGON_XS[i] * scaleFit + offsetX + SPRING_DX[i];
              const by = DRAGON_YS[i] * scaleFit + offsetY + SPRING_DY[i];
              const dx = bx - orbDocX;
              const dy = by - orbDocY;
              const dSq = dx * dx + dy * dy;
              if (dSq < bestDistSq) {
                bestDistSq = dSq;
                hitIdx = i;
              }
            }

            if (hitIdx !== -1) {
              orb.hasShiftedDragon = true;
              orb.spark = 1;
              shiftDragonConfiguration();
              pulsesRef.current.push({
                origin: hitIdx,
                dist: 0,
                speed: Math.max(7, count * 0.025),
                alpha: 1,
              });
              const screenY = orb.y - scrollY;
              playNote(
                Math.max(0.05, Math.min(0.95, orb.x / Math.max(1, width))),
                Math.max(0.1, Math.min(0.9, screenY / Math.max(1, height))),
                {
                  gain: 0.22,
                  duration: 1.0,
                  unlockIfNeeded: false,
                  rippleAt: { x: orb.x, y: screenY, hideLabel: true },
                }
              );
            }
          }
        }

        // Advance click / orb-hit energy pulses racing along the curve
        const activePulses: DragonPulse[] = [];
        for (const pulse of pulsesRef.current) {
          pulse.dist += pulse.speed;
          pulse.alpha *= 0.962;
          if (pulse.alpha > 0.03 && pulse.dist < count + 80) {
            activePulses.push(pulse);
          }
        }
        pulsesRef.current = activePulses;

        // Smooth velocity-driven silk spring physics (no fisheye magnifying-bubble when hovering still)
        const brushSpeed = Math.hypot(smoothBrushVx, smoothBrushVy);
        const brushActive = ptr.active && !ptr.isThrowing && brushSpeed > 0.25;
        const sigmaSq2 = 2 * 72 * 72; // wide smooth Gaussian bell
        const touchCutoffSq = 155 * 155;
        const maxDisp = 24;
        const maxDispSq = maxDisp * maxDisp;

        for (let i = 0; i <= count; i++) {
          const bx = DRAGON_XS[i] * scaleFit + offsetX;
          const by = DRAGON_YS[i] * scaleFit + offsetY;
          let dx = SPRING_DX[i];
          let dy = SPRING_DY[i];
          let vx = SPRING_VX[i];
          let vy = SPRING_VY[i];

          const px = bx + dx;
          const py = by + dy;

          // Gentle Gaussian silk-flow follow when brushing across the fractal
          if (brushActive) {
            const cx = px - docPtrX;
            const cy = py - docPtrY;
            const dSq = cx * cx + cy * cy;
            if (dSq < touchCutoffSq) {
              const g = Math.exp(-dSq / sigmaSq2);
              const moveFactor = Math.min(1, brushSpeed / 12);
              vx += smoothBrushVx * 0.085 * g;
              vy += smoothBrushVy * 0.085 * g;
              if (dSq > 1) {
                const d = Math.sqrt(dSq);
                vx += (cx / d) * 0.22 * moveFactor * g;
                vy += (cy / d) * 0.22 * moveFactor * g;
              }
            }
          }

          // Orbiting & thrown orbs smoothly wake nearby silk threads as they pass through
          for (let oIdx = 0; oIdx < orbs.length; oIdx++) {
            const orb = orbs[oIdx];
            const mx = px - orb.x;
            const my = py - orb.y;
            const mdSq = mx * mx + my * my;
            if (mdSq < 66 * 66 && mdSq > 0.5) {
              const g = Math.exp(-mdSq / (2 * 34 * 34));
              vx += orb.vx * 0.08 * g;
              vy += orb.vy * 0.08 * g;
            }
          }

          // Subtle elastic shimmer on energy pulses
          for (let pIdx = 0; pIdx < activePulses.length; pIdx++) {
            const pulse = activePulses[pIdx];
            const delta = Math.abs(Math.abs(i - pulse.origin) - pulse.dist);
            if (delta < 32) {
              const waveF = (1 - delta / 32) * pulse.alpha;
              const rx = bx - baseCx;
              const ry = by - baseCy;
              const rLen = Math.max(1, Math.hypot(rx, ry));
              vx += (rx / rLen) * waveF * 0.65;
              vy += (ry / rLen) * waveF * 0.65;
            }
          }

          // Smooth spring return + silky damping
          vx += -dx * 0.055;
          vy += -dy * 0.055;
          vx *= 0.87;
          vy *= 0.87;
          dx += vx;
          dy += vy;

          const dispSq = dx * dx + dy * dy;
          if (dispSq > maxDispSq) {
            const disp = Math.sqrt(dispSq);
            dx = (dx / disp) * maxDisp;
            dy = (dy / disp) * maxDisp;
          }

          SPRING_DX[i] = dx;
          SPRING_DY[i] = dy;
          SPRING_VX[i] = vx;
          SPRING_VY[i] = vy;
          FINAL_XS[i] = bx + dx;
          FINAL_YS[i] = by + dy;
        }

        const baseAlpha = isDesktop
          ? isDark
            ? 0.8
            : 0.72
          : isDark
            ? 0.3
            : 0.24;
        const chunks = 32;
        const chunkSize = Math.max(1, Math.ceil(count / chunks));
        const baseLineW =
          smoothFolds >= 11.5 ? 1.1 : smoothFolds >= 9 ? 1.45 : 1.9;

        dragonCtx.save();
        dragonCtx.lineCap = "round";
        dragonCtx.lineJoin = "round";

        for (let c = 0; c < chunks; c++) {
          const start = c * chunkSize;
          if (start >= count) break;
          const end = Math.min(count, start + chunkSize);
          const midIdx = Math.floor((start + end) / 2);
          const ratio = c / Math.max(1, chunks - 1);

          const dispMag = Math.min(
            1,
            Math.hypot(SPRING_DX[midIdx], SPRING_DY[midIdx]) / 12
          );
          let pulseBoost = 0;
          for (let pIdx = 0; pIdx < activePulses.length; pIdx++) {
            const pulse = activePulses[pIdx];
            const delta = Math.abs(
              Math.abs(midIdx - pulse.origin) - pulse.dist
            );
            if (delta < 48) {
              pulseBoost = Math.max(
                pulseBoost,
                (1 - delta / 48) * pulse.alpha
              );
            }
          }

          const r = isDark
            ? Math.round(90 + (242 - 90) * ratio + pulseBoost * 60)
            : Math.round(14 + (194 - 14) * ratio);
          const g = isDark
            ? Math.round(209 + (184 - 209) * ratio + pulseBoost * 40)
            : Math.round(138 + (120 - 138) * ratio);
          const b = isDark
            ? Math.round(200 + (114 - 200) * ratio + pulseBoost * 50)
            : Math.round(128 + (36 - 128) * ratio);

          dragonCtx.globalAlpha = Math.min(
            1,
            baseAlpha + dispMag * 0.28 + pulseBoost * 0.45 + audioLevel * 0.25
          );
          dragonCtx.lineWidth = baseLineW + dispMag * 0.55 + pulseBoost * 1.1;
          dragonCtx.strokeStyle = `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
          dragonCtx.beginPath();
          dragonCtx.moveTo(FINAL_XS[start], FINAL_YS[start]);
          for (let i = start + 1; i <= end; i++) {
            dragonCtx.lineTo(FINAL_XS[i], FINAL_YS[i]);
          }
          dragonCtx.stroke();
        }
        dragonCtx.restore();
      } else if (!st.dragonOn) {
        dragonCtx.clearRect(0, 0, dragonW, dragonH);
      }

      // === LAYER 3 (Fixed Vector Canvas): Orbiting + Thrown Bouncing Orbs, Pluckable Strings, Ripples ===
      vecCtx.clearRect(0, 0, width, height);

      const wellX = heroCenterRef.current.x;
      const wellY = heroCenterRef.current.y; // document space
      const wellScreenY = wellY - scrollY;

      // Subtle central gravity marker inside the fractal when visible
      if (st.dragonOn && wellScreenY > -40 && wellScreenY < height + 40) {
        vecCtx.save();
        vecCtx.strokeStyle = isDark
          ? "rgba(90, 209, 200, 0.22)"
          : "rgba(14, 138, 128, 0.22)";
        vecCtx.lineWidth = 1;
        vecCtx.beginPath();
        vecCtx.arc(wellX, wellScreenY, 4.5, 0, Math.PI * 2);
        vecCtx.stroke();
        vecCtx.restore();
      }

      // Update orbs: orbiting moons stay in the well (thrown moons do 3 x 360° revolutions then slingshot out); free/ejected orbs exit past the screen border
      const survivingOrbs: Orb[] = [];
      const exitMargin = 110;

      for (let oIdx = 0; oIdx < orbs.length; oIdx++) {
        const orb = orbs[oIdx];
        const prevScreenY = orb.y - scrollY;
        orb.age += 1;

        const dxW = wellX - orb.x;
        const dyW = wellY - orb.y;
        const distW = Math.hypot(dxW, dyW);
        const distSqW = dxW * dxW + dyW * dyW + GRAVITY_SOFTENING;

        if (orb.phase === "orbiting") {
          // Orbital gravity around the fractal center
          const acc = GRAVITY_G / distSqW;
          orb.vx += (dxW / Math.max(1, distW)) * acc;
          orb.vy += (dyW / Math.max(1, distW)) * acc;

          // Gentle moon-to-moon perturbation
          for (let other = 0; other < orbs.length; other++) {
            if (other === oIdx || orbs[other].phase !== "orbiting") continue;
            const o = orbs[other];
            const mdx = o.x - orb.x;
            const mdy = o.y - orb.y;
            const mdSq = mdx * mdx + mdy * mdy + 650;
            if (mdSq < 170 * 170) {
              const md = Math.sqrt(mdSq);
              const pull = 30 / mdSq;
              orb.vx += (mdx / md) * pull;
              orb.vy += (mdy / md) * pull;
            }
          }

          // Keep orbits gracefully contained around the hero
          if (distW > 265) {
            orb.vx += (dxW / distW) * 0.22;
            orb.vy += (dyW / distW) * 0.22;
          }

          const speed = Math.hypot(orb.vx, orb.vy);
          const idealSpeed = Math.sqrt(GRAVITY_G / Math.max(60, distW));
          if (speed > idealSpeed * 1.45) {
            orb.vx *= 0.985;
            orb.vy *= 0.985;
          }

          orb.x += orb.vx;
          orb.y += orb.vy;

          // Track exact swept angular translation for EVERY orbiting moon -> release cleanly on its tangent line after 3 x 360°
          const curAngle = Math.atan2(orb.y - wellY, orb.x - wellX);
          let dTheta = curAngle - orb.orbitAngle;
          if (dTheta > Math.PI) dTheta -= Math.PI * 2;
          if (dTheta < -Math.PI) dTheta += Math.PI * 2;
          orb.orbitAngle = curAngle;
          orb.sweptRad += Math.abs(dTheta);

          if (orb.sweptRad >= EJECT_SWEEP_RAD) {
            // Release from gravity — keep exact current velocity so it glides out in a straight tangent line
            orb.phase = "released";
            orb.spark = 0.7;

            const screenY = orb.y - scrollY;
            if (screenY > -40 && screenY < height + 40) {
              playNote(
                Math.max(0.05, Math.min(0.95, orb.x / Math.max(1, width))),
                Math.max(0.1, Math.min(0.9, screenY / Math.max(1, height))),
                {
                  gain: 0.14,
                  duration: 0.85,
                  unlockIfNeeded: false,
                }
              );
            }
          }

          // Soft ambient chime at periapsis when visible
          if (orb.phase === "orbiting") {
            const dr =
              ((orb.x - wellX) * orb.vx + (orb.y - wellY) * orb.vy) /
              Math.max(1, distW);
            if (
              orb.prevDr < 0 &&
              dr >= 0 &&
              distW < 230 &&
              wellScreenY > -120 &&
              wellScreenY < height + 120 &&
              nowMs - orb.lastChimeAt > 1500
            ) {
              orb.lastChimeAt = nowMs;
              orb.spark = 0.85;
              playNote(
                Math.max(0.05, Math.min(0.95, orb.x / Math.max(1, width))),
                Math.max(
                  0.1,
                  Math.min(0.9, (orb.y - scrollY) / Math.max(1, height))
                ),
                { gain: 0.12, duration: 0.9, unlockIfNeeded: false }
              );
            }
            orb.prevDr = dr;
          }
        } else {
          // "free" (newly thrown) or "ejected" (slingshotted out of orbit toward the screen border)
          if (orb.phase === "free" && st.dragonOn && distW < GRAVITY_INFLUENCE_RADIUS) {
            const pullFactor =
              1 -
              Math.max(0, (distW - 140) / (GRAVITY_INFLUENCE_RADIUS - 140));
            const acc = (GRAVITY_G / distSqW) * (0.45 + 0.55 * pullFactor);
            orb.vx += (dxW / Math.max(1, distW)) * acc;
            orb.vy += (dyW / Math.max(1, distW)) * acc;

            // Capture into orbit when entering the fractal's gravity well
            if (orb.age > 5 && distW < GRAVITY_CAPTURE_RADIUS) {
              const idealSpeed = Math.sqrt(GRAVITY_G / Math.max(70, distW));
              const ux = -dxW / Math.max(1, distW);
              const uy = -dyW / Math.max(1, distW);
              const tx = -uy;
              const ty = ux;
              const tangential = orb.vx * tx + orb.vy * ty;
              const radial = orb.vx * ux + orb.vy * uy;
              const sign = tangential >= 0 ? 1 : -1;
              const targetTan = Math.max(
                idealSpeed * 0.78,
                Math.min(idealSpeed * 1.22, Math.abs(tangential))
              );
              const targetRad = radial * 0.45;
              orb.vx = tx * targetTan * sign + ux * targetRad;
              orb.vy = ty * targetTan * sign + uy * targetRad;
              orb.phase = "orbiting";
              orb.orbitAngle = Math.atan2(orb.y - wellY, orb.x - wellX);
              orb.sweptRad = 0;
              orb.spark = 1;
              orb.prevDr = targetRad;
            }
          }

          orb.x += orb.vx;
          orb.y += orb.vy;

          const curScreenY = orb.y - scrollY;

          // Strumming any section divider string (including navbar border) crossed in flight
          if (orb.phase !== "orbiting" && Math.abs(orb.vy) > 0.3) {
            const yMin = Math.min(prevScreenY, curScreenY);
            const yMax = Math.max(prevScreenY, curScreenY);
            for (let dIdx = 0; dIdx < dividerEls.length; dIdx++) {
              const el = dividerEls[dIdx];
              const rect = el.getBoundingClientRect();
              const kind = el.dataset.soundDivider;
              const lineY = kind === "bottom" ? rect.bottom : rect.top;
              if (lineY < yMin || lineY > yMax) continue;
              const isFull = kind === "full" || kind === "bottom";
              const x0 = isFull ? 0 : rect.left;
              const x1 = isFull ? width : rect.right;
              if (orb.x < x0 || orb.x > x1) continue;

              let str = dividerStatesRef.current.get(el);
              if (!str) {
                str = {
                  pluckX: 0.5,
                  disp: 0,
                  vel: 0,
                  glow: 0,
                  lastStrumAt: 0,
                };
                dividerStatesRef.current.set(el, str);
              }
              if (nowMs - str.lastStrumAt > 120) {
                const norm = Math.max(
                  0.04,
                  Math.min(0.96, (orb.x - x0) / Math.max(1, x1 - x0))
                );
                str.pluckX = norm;
                str.vel += Math.max(-18, Math.min(18, orb.vy * 1.05));
                str.glow = 1;
                str.lastStrumAt = nowMs;
                playNote(norm, lineY / Math.max(1, height), {
                  gain: 0.16,
                  duration: 0.85,
                  unlockIfNeeded: false,
                });
              }
            }
          }

          // Disappear smoothly once past the screen border (no wall bounce)
          if (
            orb.phase !== "orbiting" &&
            (orb.x < -exitMargin ||
              orb.x > width + exitMargin ||
              curScreenY < -exitMargin ||
              curScreenY > height + exitMargin)
          ) {
            continue;
          }
        }

        orb.spark *= 0.9;
        orb.trail.push({ x: orb.x, y: orb.y });
        const maxTrail = orb.phase === "orbiting" ? 34 : 26;
        if (orb.trail.length > maxTrail) orb.trail.shift();

        // Render orb on screen (converting document Y -> viewport Y)
        const drawY = orb.y - scrollY;
        if (drawY > -120 && drawY < height + 120) {
          const rgb = orb.amber
            ? isDark
              ? "242, 184, 114"
              : "194, 120, 36"
            : isDark
              ? "90, 209, 200"
              : "14, 138, 128";

          if (orb.trail.length > 1) {
            vecCtx.save();
            vecCtx.lineCap = "round";
            for (let k = 1; k < orb.trail.length; k++) {
              const ratio = k / orb.trail.length;
              vecCtx.strokeStyle = `rgba(${rgb}, ${ratio * (isDark ? 0.56 : 0.46)})`;
              vecCtx.lineWidth = Math.max(0.6, ratio * orb.radius * 0.95);
              vecCtx.beginPath();
              vecCtx.moveTo(orb.trail[k - 1].x, orb.trail[k - 1].y - scrollY);
              vecCtx.lineTo(orb.trail[k].x, orb.trail[k].y - scrollY);
              vecCtx.stroke();
            }
            vecCtx.restore();
          }

          vecCtx.save();
          if (orb.spark > 0.05) {
            vecCtx.strokeStyle = `rgba(${rgb}, ${orb.spark * 0.65})`;
            vecCtx.lineWidth = 1.2;
            vecCtx.beginPath();
            vecCtx.arc(
              orb.x,
              drawY,
              orb.radius + (1 - orb.spark) * 18,
              0,
              Math.PI * 2
            );
            vecCtx.stroke();
          }
          vecCtx.fillStyle = `rgb(${rgb})`;
          vecCtx.beginPath();
          vecCtx.arc(orb.x, drawY, orb.radius, 0, Math.PI * 2);
          vecCtx.fill();
          vecCtx.restore();
        }

        survivingOrbs.push(orb);
      }
      orbsRef.current = survivingOrbs;

      // Render drag-and-throw aim tether + predicted trajectory (curves into gravity near the fractal, exits cleanly off-screen)
      if (ptr.down && ptr.isThrowing) {
        const sx = ptr.downX;
        const sy = ptr.downY;
        const dx = sx - ptr.x;
        const dy = sy - ptr.y;
        let pvX = dx * 0.085;
        let pvY = dy * 0.085;
        const mag = Math.hypot(pvX, pvY);
        if (mag > 0.01) {
          const clamped = Math.max(4.5, Math.min(16, mag));
          pvX = (pvX / mag) * clamped;
          pvY = (pvY / mag) * clamped;
        }

        vecCtx.save();
        vecCtx.strokeStyle = isDark
          ? "rgba(242, 184, 114, 0.55)"
          : "rgba(194, 120, 36, 0.55)";
        vecCtx.lineWidth = 1.2;
        vecCtx.setLineDash([4, 4]);
        vecCtx.beginPath();
        vecCtx.moveTo(sx, sy);
        vecCtx.lineTo(ptr.x, ptr.y);
        vecCtx.stroke();
        vecCtx.setLineDash([]);

        vecCtx.fillStyle = isDark ? "#f2b872" : "#c27824";
        vecCtx.beginPath();
        vecCtx.arc(sx, sy, 3.6, 0, Math.PI * 2);
        vecCtx.fill();

        let simX = sx;
        let simY = sy + scrollY;
        let simVx = pvX;
        let simVy = pvY;
        for (let step = 0; step < 34; step++) {
          const gx = wellX - simX;
          const gy = wellY - simY;
          const gd = Math.hypot(gx, gy);
          if (st.dragonOn && gd < GRAVITY_INFLUENCE_RADIUS) {
            const pf =
              1 - Math.max(0, (gd - 140) / (GRAVITY_INFLUENCE_RADIUS - 140));
            const gAcc =
              (GRAVITY_G / (gx * gx + gy * gy + GRAVITY_SOFTENING)) *
              (0.45 + 0.55 * pf);
            simVx += (gx / Math.max(1, gd)) * gAcc;
            simVy += (gy / Math.max(1, gd)) * gAcc;
          }
          simX += simVx;
          simY += simVy;
          const drawSimY = simY - scrollY;
          if (simX < 0 || simX > width || drawSimY < 0 || drawSimY > height) {
            break;
          }
          if (step % 2 === 0) {
            const a = (1 - step / 34) * 0.62;
            vecCtx.fillStyle = isDark
              ? `rgba(90, 209, 200, ${a})`
              : `rgba(14, 138, 128, ${a})`;
            vecCtx.beginPath();
            vecCtx.arc(simX, drawSimY, 1.4, 0, Math.PI * 2);
            vecCtx.fill();
          }
        }
        vecCtx.restore();
      }

      // Render pluckable elastic section divider strings
      const restingStroke = isDark
        ? "rgba(255, 255, 255, 0.085)"
        : "rgba(20, 23, 31, 0.1)";

      for (let dIdx = 0; dIdx < dividerEls.length; dIdx++) {
        const el = dividerEls[dIdx];
        const rect = el.getBoundingClientRect();
        const kind = el.dataset.soundDivider;
        const yRaw = kind === "bottom" ? rect.bottom : rect.top;
        if (yRaw < -60 || yRaw > height + 60) continue;

        let str = dividerStatesRef.current.get(el);
        if (!str) {
          str = { pluckX: 0.5, disp: 0, vel: 0, glow: 0, lastStrumAt: 0 };
          dividerStatesRef.current.set(el, str);
        }

        str.vel += -str.disp * 0.24;
        str.vel *= 0.9;
        str.disp += str.vel;
        if (Math.abs(str.disp) < 0.03 && Math.abs(str.vel) < 0.03) {
          str.disp = 0;
          str.vel = 0;
        }
        str.glow = Math.max(
          str.glow * 0.955,
          Math.min(1, Math.abs(str.disp) / 11)
        );

        const isFull = kind === "full" || kind === "bottom";
        const x0 = isFull ? 0 : rect.left;
        const x1 = isFull ? width : rect.right;
        const spanW = Math.max(1, x1 - x0);
        const yBase = Math.round(yRaw) + 0.5;

        const audioActiveHere =
          waveVisibility > 0.01 && Boolean(timeData) && st.soundOn;
        const pluckActiveHere = Math.abs(str.disp) > 0.04 || str.glow > 0.02;
        const energy = Math.max(str.glow, audioActiveHere ? waveVisibility : 0);

        if (energy < 0.95) {
          vecCtx.save();
          vecCtx.strokeStyle = restingStroke;
          vecCtx.globalAlpha = 1 - energy * 0.7;
          vecCtx.lineWidth = 1;
          vecCtx.beginPath();
          vecCtx.moveTo(x0, yBase);
          vecCtx.lineTo(x1, yBase);
          vecCtx.stroke();
          vecCtx.restore();
        }

        if (audioActiveHere || pluckActiveHere) {
          vecCtx.save();
          const waveGrad = vecCtx.createLinearGradient(x0, 0, x1, 0);
          waveGrad.addColorStop(0, restingStroke);
          waveGrad.addColorStop(0.14, isDark ? "#5ad1c8" : "#0e8a80");
          waveGrad.addColorStop(0.86, isDark ? "#f2b872" : "#c27824");
          waveGrad.addColorStop(1, restingStroke);

          vecCtx.globalAlpha = Math.min(1, energy * (isDark ? 0.85 : 0.75));
          vecCtx.strokeStyle = waveGrad;
          vecCtx.lineWidth = 1.25 + str.glow * 0.65;
          vecCtx.beginPath();

          const segments = 160;
          const samples = timeData ? timeData.length : 1;
          const phaseShift = (dIdx * 97) % samples;
          const maxAudioAmp = (isFull ? 22 : 15) * waveVisibility;
          const p = str.pluckX;

          for (let i = 0; i <= segments; i++) {
            const norm = i / segments;
            const x = x0 + norm * spanW;

            let yOffset = 0;
            if (Math.abs(str.disp) > 0.03) {
              const tent =
                norm < p
                  ? norm / Math.max(0.01, p)
                  : (1 - norm) / Math.max(0.01, 1 - p);
              yOffset += str.disp * Math.sin(tent * Math.PI * 0.5);
            }

            if (audioActiveHere && timeData) {
              const env = Math.pow(Math.sin(norm * Math.PI), 0.7);
              const sampleIdx =
                (Math.floor(norm * (samples - 1)) + phaseShift) % samples;
              const v = (timeData[sampleIdx] - 128) / 128;
              yOffset += v * maxAudioAmp * env;
            }

            const y = yBase + yOffset;
            if (i === 0) vecCtx.moveTo(x, y);
            else vecCtx.lineTo(x, y);
          }
          vecCtx.stroke();
          vecCtx.restore();
        }
      }

      // Render expanding harmonic ripple rings
      if (ripplesRef.current.length > 0) {
        const nextRipples: Ripple[] = [];
        for (const r of ripplesRef.current) {
          r.radius += (r.maxRadius - r.radius) * 0.065 + 0.65;
          r.alpha *= 0.962;
          if (r.alpha > 0.015) {
            vecCtx.save();
            vecCtx.strokeStyle = r.color;
            vecCtx.globalAlpha = r.alpha;
            vecCtx.lineWidth = 1.4;
            vecCtx.beginPath();
            vecCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            vecCtx.stroke();

            vecCtx.globalAlpha = r.alpha * 0.35;
            vecCtx.beginPath();
            vecCtx.arc(r.x, r.y, r.radius * 0.56, 0, Math.PI * 2);
            vecCtx.stroke();

            if (r.label) {
              vecCtx.globalAlpha = Math.min(0.85, r.alpha * 1.15);
              vecCtx.fillStyle = r.color;
              vecCtx.font = "500 10px ui-monospace, monospace";
              vecCtx.textAlign = "center";
              vecCtx.fillText(r.label, r.x, r.y - 8 - (1 - r.alpha) * 14);
            }
            vecCtx.restore();

            nextRipples.push(r);
          }
        }
        ripplesRef.current = nextRipples;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      heroObserver?.disconnect();
    };
  }, [playNote, seedInitialMoons, shiftDragonConfiguration]);

  const layers: {
    id: LayerId;
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "flow", active: flowOn, icon: Orbit },
    { id: "dragon", active: dragonOn, icon: GitBranch },
    { id: "sound", active: soundOn, icon: AudioWaveform },
  ];

  const segments = 1 << folds;

  return (
    <>
      {/* Fixed ambient canvases: Flow currents + Thrown bouncing orbs + Pluckable section strings + Ripples */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <canvas
          ref={flowCanvasRef}
          className="absolute inset-0 block h-full w-full"
        />
        <canvas
          ref={vectorCanvasRef}
          className="absolute inset-0 block h-full w-full"
        />
      </div>

      {/* Absolutely positioned hero canvas: Smooth spring-physics Dragon Curve */}
      <canvas
        ref={dragonCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 block w-full"
      />

      {/* Whisper-quiet floating control dock */}
      <div
        ref={dockRef}
        data-ui-control="true"
        className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6"
      >
        {openPanel && (
          <div className="w-[min(calc(100vw-2rem),310px)] rounded-2xl border border-line bg-surface-elevated/90 p-3.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink">
                  {t.playground.tabs[openPanel].label}
                </span>
                {openPanel === "dragon" && (
                  <span className="font-mono text-[10px] text-ink-faint">
                    2<sup>{folds}</sup> = {segments.toLocaleString()}
                  </span>
                )}
                {openPanel === "sound" && lastNote && (
                  <span className="font-mono text-[10px] text-accent-teal">
                    {lastNote}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (openPanel === "flow") setFlowOn((v) => !v);
                    if (openPanel === "dragon") setDragonOn((v) => !v);
                    if (openPanel === "sound") setSoundOn((v) => !v);
                  }}
                  aria-label="Toggle layer"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink"
                >
                  {(openPanel === "flow" && flowOn) ||
                  (openPanel === "dragon" && dragonOn) ||
                  (openPanel === "sound" && soundOn) ? (
                    <Eye className="h-3.5 w-3.5 text-accent-teal" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPanel(null)}
                  aria-label="Close"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {openPanel === "flow" && (
              <div className="flex flex-col gap-2.5">
                <div className="flex rounded-lg border border-line bg-surface/80 p-0.5">
                  {(["orbit", "attract", "repel"] as ForceMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setFlowOn(true);
                        setForceMode(m);
                      }}
                      className={`flex-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                        forceMode === m
                          ? "bg-surface-elevated text-ink shadow-sm"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {t.playground.controls[m]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setLongTrails((v) => !v)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      longTrails
                        ? "border-accent-teal/60 bg-accent-teal/10 text-accent-teal"
                        : "border-line bg-surface/80 text-ink-muted hover:text-ink"
                    }`}
                  >
                    {t.playground.controls.trails}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFlowOn(true);
                      setFlowSeed((s) => s + 1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/80 px-2.5 py-1 font-mono text-[11px] text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>{t.playground.controls.reseed}</span>
                  </button>
                </div>
              </div>
            )}

            {openPanel === "dragon" && (
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    {t.playground.controls.folds}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={2}
                      max={12}
                      value={folds}
                      onChange={(e) => {
                        setDragonOn(true);
                        setFolds(Number(e.target.value));
                      }}
                      className="lab-slider w-32"
                    />
                    <span className="w-5 text-right font-mono text-[11px] text-ink">
                      {folds}
                    </span>
                  </div>
                </label>

                <label className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    {t.playground.controls.angle}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={180}
                      step={1}
                      value={angle}
                      onChange={(e) => {
                        setDragonOn(true);
                        setMorphing(false);
                        setAngle(Number(e.target.value));
                      }}
                      className="lab-slider w-32"
                    />
                    <span className="w-7 text-right font-mono text-[11px] text-ink">
                      {angle}°
                    </span>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDragonOn(true);
                      setMorphing((m) => !m);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      morphing
                        ? "border-accent-teal bg-accent-teal/10 text-accent-teal"
                        : "border-line bg-surface/80 text-ink hover:border-ink-faint"
                    }`}
                  >
                    {morphing ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    <span>
                      {morphing
                        ? t.playground.controls.pause
                        : t.playground.controls.breathe}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      dragonPresetIdxRef.current = 0;
                      setDragonOn(true);
                      setFolds(10);
                      setAngle(90);
                      setMorphing(false);
                      SPRING_DX.fill(0);
                      SPRING_DY.fill(0);
                      SPRING_VX.fill(0);
                      SPRING_VY.fill(0);
                      orbsRef.current = [];
                      seedInitialMoons();
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface/80 px-2.5 py-1 font-mono text-[11px] text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{t.playground.controls.reset}</span>
                  </button>
                </div>
              </div>
            )}

            {openPanel === "sound" && (
              <div className="flex flex-col gap-2.5">
                <div className="flex rounded-lg border border-line bg-surface/80 p-0.5">
                  {(["pentatonic", "lydian", "minor"] as ScaleKey[]).map(
                    (key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSoundOn(true);
                          setScale(key);
                        }}
                        className={`flex-1 rounded-md px-2 py-1 font-mono text-[11px] capitalize transition-colors ${
                          scale === key
                            ? "bg-surface-elevated text-ink shadow-sm"
                            : "text-ink-muted hover:text-ink"
                        }`}
                      >
                        {key}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex rounded-lg border border-line bg-surface/80 p-0.5">
                    {(["sine", "triangle", "sawtooth"] as WaveType[]).map(
                      (w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => {
                            setSoundOn(true);
                            setWave(w);
                          }}
                          className={`rounded-md px-2 py-1 font-mono text-[11px] capitalize transition-colors ${
                            wave === w
                              ? "bg-surface-elevated text-ink shadow-sm"
                              : "text-ink-muted hover:text-ink"
                          }`}
                        >
                          {w === "sawtooth" ? "saw" : w}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={playChord}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface/80 px-2.5 py-1 font-mono text-[11px] text-ink transition-colors hover:border-accent-amber hover:text-accent-amber"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{t.playground.controls.chord}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compact pill bar */}
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface-elevated/80 p-1 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {layers.map(({ id, active, icon: Icon }) => {
            const isOpen = openPanel === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOpenPanel(isOpen ? null : id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isOpen
                    ? "bg-ink text-surface"
                    : active
                      ? "text-ink hover:bg-surface-subtle/80"
                      : "text-ink-faint line-through hover:text-ink-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                    active
                      ? isOpen
                        ? "bg-accent-amber"
                        : "bg-accent-teal"
                      : "bg-ink-faint/40"
                  }`}
                />
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {t.playground.tabs[id].label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
