"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { projects, strings, type Project } from "@/lib/content";
import { ProjectDetails, ProjectMeta, type Translate } from "./NightProject";
import h from "./NightHouse.module.css";
import ns from "./PortfolioNight.module.css";

type Pt = { x: number; y: number };
/** Camera framing: put image point `f` (fractions of the plate) at frame point `t`, scaled by `s`. */
type Shot = { f: Pt; t: Pt; s: number };
type ProjectScene = "remy" | "heladera" | "withdrawal" | "jarvis" | "sleepsync";
type Scene = "intro" | "work" | "walk" | ProjectScene;
/**
 * cover: never show the stage behind the plate · allowLeft: may slide right (desktop close-ups,
 * the gap sits under the cards) · allowBottom: may slide up (phone close-ups, the gap sits under
 * the parked card and the fade) · free: no clamp.
 */
type Edges = "cover" | "allowLeft" | "allowBottom" | "free";
type SceneVars = React.CSSProperties & Record<`--${string}`, string | number>;

type ShotName =
  | "hero"
  | "base"
  | "stove"
  | "stoveIn"
  | "stoveHold"
  | "fridge"
  | "fridgeIn"
  | "fridgeHold"
  | "door"
  | "deskBase"
  | "monitor"
  | "bed";
type Shots = Record<ShotName, Shot>;

const shot = (fx: number, fy: number, tx: number, ty: number, s: number): Shot => ({
  f: { x: fx, y: fy },
  t: { x: tx, y: ty },
  s,
});

// Points measured on the plates. Kitchen: pan (0.17, 0.60), fridge (0.555, 0.58), hallway door
// (0.385, 0.50). Close-ups: pan (0.47, 0.62), fridge interior (0.48, 0.60). Desk: monitor centre
// (0.497, 0.51). On desktop the subject sits right of centre so the cards on the left never cover it.
const DESKTOP: Shots = {
  hero: shot(0.45, 0.55, 0.62, 0.5, 1.12),
  base: shot(0.42, 0.55, 0.58, 0.5, 1.08),
  stove: shot(0.17, 0.6, 0.68, 0.5, 2.8),
  stoveIn: shot(0.47, 0.62, 0.68, 0.5, 1.3),
  stoveHold: shot(0.47, 0.62, 0.68, 0.5, 1.06),
  fridge: shot(0.555, 0.58, 0.68, 0.5, 2.4),
  fridgeIn: shot(0.48, 0.6, 0.68, 0.5, 1.3),
  fridgeHold: shot(0.48, 0.6, 0.68, 0.5, 1.06),
  door: shot(0.385, 0.5, 0.5, 0.5, 4.2),
  deskBase: shot(0.5, 0.52, 0.6, 0.5, 1.08),
  monitor: shot(0.497, 0.51, 0.7, 0.5, 2.4),
  bed: shot(0.45, 0.55, 0.62, 0.5, 1.1),
};

// On phones the scene lives in the top 64svh and the cards scroll below it. The nav covers the
// frame's top ~13% and the fade into the cards starts around 80%, so subjects are aimed at ~45%
// of the frame, and close-ups zoom past 1× so there's room to frame them vertically (at 1× the
// plate is exactly as tall as the frame and can't move). Steam above the pan and the fridge's
// shelves now sit in the clear band instead of under the fade.
const MOBILE: Shots = {
  hero: shot(0.45, 0.55, 0.5, 0.5, 1),
  base: shot(0.42, 0.55, 0.5, 0.5, 1),
  stove: shot(0.17, 0.6, 0.5, 0.45, 2.4),
  stoveIn: shot(0.47, 0.56, 0.5, 0.45, 1.45),
  stoveHold: shot(0.47, 0.56, 0.5, 0.45, 1.3),
  fridge: shot(0.555, 0.56, 0.5, 0.47, 2.1),
  fridgeIn: shot(0.46, 0.66, 0.5, 0.47, 1.2),
  fridgeHold: shot(0.46, 0.66, 0.5, 0.47, 1),
  door: shot(0.385, 0.5, 0.5, 0.5, 3.5),
  deskBase: shot(0.5, 0.5, 0.5, 0.47, 1.1),
  monitor: shot(0.497, 0.51, 0.5, 0.47, 1.75),
  bed: shot(0.4, 0.6, 0.5, 0.5, 1),
};

/** The monitor's screen on the desk plate (fractions of the 2048×1152 image). */
const SCREEN = { x: 0.3935, y: 0.4018, w: 0.207, h: 0.2178 };

// With reduced motion the camera never zooms; scenes only cross-fade.
const still = (set: Shots): Shots =>
  Object.fromEntries(Object.entries(set).map(([k, v]) => [k, { ...v, s: 1 }])) as Shots;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const mix = (a: Shot, b: Shot, p: number): Shot => ({
  f: { x: lerp(a.f.x, b.f.x, p), y: lerp(a.f.y, b.f.y, p) },
  t: { x: lerp(a.t.x, b.t.x, p), y: lerp(a.t.y, b.t.y, p) },
  s: lerp(a.s, b.s, p),
});
const nudge = (a: Shot, dx: number): Shot => ({ ...a, t: { x: a.t.x + dx, y: a.t.y } });

/**
 * Writes the transform that frames `cam` inside a frame of `fw`×`fh` for a plate of `w`×`h`
 * (unscaled) and returns the plate centre's offset from the frame centre.
 */
function place(el: HTMLElement, w: number, h: number, fw: number, fh: number, cam: Shot, edges: Edges) {
  let tx = cam.t.x * fw - fw / 2 - (cam.f.x - 0.5) * w * cam.s;
  let ty = cam.t.y * fh - fh / 2 - (cam.f.y - 0.5) * h * cam.s;
  if (edges !== "free") {
    const minX = fw / 2 - (w * cam.s) / 2; // right edge stays past the frame
    const maxX = (w * cam.s) / 2 - fw / 2; // left edge stays past the frame
    const minY = fh / 2 - (h * cam.s) / 2;
    const maxY = (h * cam.s) / 2 - fh / 2;
    tx = edges === "allowLeft" ? Math.max(minX, tx) : Math.min(maxX, Math.max(minX, tx));
    ty = edges === "allowBottom" ? Math.min(maxY, ty) : Math.min(maxY, Math.max(minY, ty));
  }
  el.style.transform = `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${cam.s.toFixed(4)})`;
  return { tx, ty };
}

function getProject(id: string): Project {
  const project = projects.find((p) => p.id === id);
  if (!project) throw new Error(`NightHouse: unknown project id "${id}"`);
  return project;
}

// The night in order: dinner, the late snack, then the bedroom — desk, screen, and bed before dawn.
const HOUSE_PROJECTS: { scene: ProjectScene; project: Project; hour: string; vars: SceneVars }[] = [
  {
    scene: "remy",
    project: getProject("remy"),
    hour: "21:00",
    vars: { "--bg": "#120d09", "--accent": "#e4a464", "--muted": "#ab9d8c" },
  },
  {
    scene: "heladera",
    project: getProject("heladera"),
    hour: "22:30",
    vars: { "--bg": "#0c1213", "--accent": "#9ad3c4", "--muted": "#93a5a1" },
  },
  {
    scene: "withdrawal",
    project: getProject("withdrawal"),
    hour: "01:00",
    vars: { "--bg": "#0a0f0c", "--accent": "#a3d9b4", "--muted": "#94a399" },
  },
  {
    scene: "jarvis",
    project: getProject("jarvis"),
    hour: "03:00",
    vars: { "--bg": "#060b12", "--accent": "#8fdcff", "--muted": "#90a3b4" },
  },
  {
    scene: "sleepsync",
    project: getProject("sleepsync"),
    hour: "05:00",
    vars: { "--bg": "#070b17", "--accent": "#a3bcff", "--muted": "#97a0b8" },
  },
];

const ORDER: Scene[] = ["intro", "work", "remy", "heladera", "walk", "withdrawal", "jarvis", "sleepsync"];

type Props = {
  t: Translate;
  /** The 20:00 opening (name, photo, intro) laid over the wide kitchen shot. */
  intro: React.ReactNode;
  /** "Selected work" statement shown before the camera starts moving. */
  workIntro: React.ReactNode;
};

export default function NightHouse({ t, intro, workIntro }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const kitchenRef = useRef<HTMLDivElement>(null);
  const stoveRef = useRef<HTMLDivElement>(null);
  const fridgeRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const bedRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segRefs = useRef<Partial<Record<Scene, HTMLElement | null>>>({});

  useEffect(() => {
    const frame = frameRef.current;
    const kitchen = kitchenRef.current;
    const stove = stoveRef.current;
    const fridge = fridgeRef.current;
    const desk = deskRef.current;
    const bed = bedRef.current;
    const screen = screenRef.current;
    const dark = darkRef.current;
    const warm = warmRef.current;
    const end = endRef.current;
    if (!frame || !kitchen || !stove || !fridge || !desk || !bed || !screen || !dark || !warm || !end) return;

    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    let raf = 0;
    let screenBase = { w: 0, h: 0 };

    // Segment positions in page coordinates, re-measured whenever the track's layout changes
    // (resize, fonts, a card's details opening on mobile) instead of on every frame.
    let segs: { id: Scene; top: number; height: number }[] = [];
    const measure = () => {
      segs = ORDER.flatMap((id) => {
        const el = segRefs.current[id];
        if (!el) return [];
        const r = el.getBoundingClientRect();
        return [{ id, top: r.top + window.scrollY, height: r.height }];
      });
    };

    // The camera follows a damped copy of the scroll position, so wheel notches and
    // trackpad flicks become one continuous move instead of a series of jumps.
    let smoothY = window.scrollY;
    let last = 0;
    let prev = { layer: "", s: 1 };

    const render = (Y: number, dt: number) => {
      const base = desktop.matches ? DESKTOP : MOBILE;
      const S = reduce.matches ? still(base) : base;
      const V = window.innerHeight;
      const fw = frame.clientWidth;
      const fh = frame.clientHeight;
      const close: Edges = desktop.matches ? "allowLeft" : "allowBottom";

      // Everything the frame shows; each scene below overrides what it needs.
      const st = {
        kitchen: { cam: S.hero, o: 1 },
        stove: { cam: S.stoveHold, o: 0 },
        fridge: { cam: S.fridgeHold, o: 0 },
        desk: { cam: S.deskBase, o: 0, edges: "cover" as Edges },
        bed: { cam: S.bed, o: 0, edges: "cover" as Edges },
        screen: { o: 0, game: 0, voice: 0 },
        night: 0,
        warm: 0,
        end: 0,
        blur: 0,
      };

      const seg = segs.find((sg) => Y >= sg.top && Y < sg.top + sg.height);
      const active = seg?.id;

      if (!seg || !active) {
        // Past the house: hold the last frame (the bed at first light).
        if (segs.length > 0 && Y >= segs[0].top) {
          st.kitchen.o = 0;
          st.bed.o = 1;
          st.warm = 0.5;
          st.end = 1;
        }
      } else {
        const y = Y - seg.top;
        const len = seg.height;
        const p = clamp01(y / len);
        // Shared rhythm for project scenes: zoom in over ~¾ screen, hold while the card scrolls, zoom out.
        const zIn = ease(clamp01(y / (0.75 * V)));
        const zOut = ease(clamp01((y - (len - 0.95 * V)) / (0.8 * V)));
        const hold = clamp01((y - 0.75 * V) / Math.max(1, len - 1.7 * V));

        switch (active) {
          case "intro":
            st.kitchen.cam = mix(S.hero, S.base, ease(p) * 0.5);
            break;
          case "work":
            st.kitchen.cam = mix(S.hero, S.base, 0.5 + ease(p) * 0.5);
            st.night = lerp(0, 0.03, p);
            break;
          case "remy":
          case "heladera": {
            const z = zIn * (1 - zOut);
            const reveal = clamp01((z - 0.55) / 0.4);
            const isRemy = active === "remy";
            st.kitchen.cam = mix(S.base, isRemy ? S.stove : S.fridge, z);
            const cam = mix(isRemy ? S.stoveIn : S.fridgeIn, isRemy ? S.stoveHold : S.fridgeHold, reveal);
            if (!reduce.matches) cam.s += 0.05 * hold * reveal;
            st[isRemy ? "stove" : "fridge"] = { cam, o: reveal };
            st.night = isRemy ? lerp(0.03, 0.07, p) : lerp(0.07, 0.15, p);
            break;
          }
          case "walk": {
            // Down the hallway: push into the door while the house goes dark.
            const w = ease(clamp01(y / Math.max(1, len - V)));
            st.kitchen.cam = mix(S.base, S.door, w);
            st.night = lerp(0.15, 1, Math.pow(w, 1.6));
            break;
          }
          case "withdrawal":
          case "jarvis": {
            // The bedroom desk. Withdrawal fades in from the dark hallway; the screen turns on as the
            // camera reaches it and goes dark again on the way out ("the PC dims, we stay in the room").
            const isGame = active === "withdrawal";
            const fadeIn = isGame ? ease(clamp01(y / (0.45 * V))) : 1;
            const zi = isGame ? ease(clamp01((y - 0.3 * V) / (0.75 * V))) : zIn;
            const z = zi * (1 - zOut);
            st.kitchen.o = 0;
            st.desk = { cam: mix(S.deskBase, S.monitor, z), o: 1, edges: "cover" };
            const on = clamp01((zi - 0.35) / 0.35) * (1 - clamp01(zOut / 0.5));
            st.screen = {
              o: isGame ? clamp01((zi - 0.15) / 0.3) : 1,
              game: isGame ? on : 0,
              voice: isGame ? 0 : on,
            };
            st.night = isGame ? lerp(1, 0.06, fadeIn) : 0.08;
            break;
          }
          case "sleepsync": {
            // Turn around: the desk whips off to the left and the bed swings in from the right.
            const turn = ease(clamp01(y / (0.7 * V)));
            st.kitchen.o = 0;
            st.desk = { cam: nudge(S.deskBase, -0.45 * turn), o: 1 - turn, edges: "free" };
            const bedCam = nudge(S.bed, 0.45 * (1 - turn));
            if (!reduce.matches) bedCam.s += 0.04 * hold;
            st.bed = { cam: bedCam, o: turn, edges: turn < 1 ? "free" : "cover" };
            st.screen = { o: 1 - turn, game: 0, voice: 0 };
            st.blur = reduce.matches ? 0 : Math.sin(Math.PI * turn) * 9;
            // First light creeps in before the dawn section takes over.
            st.warm = 0.5 * clamp01((y - (len - 1.3 * V)) / (1.1 * V));
            st.night = lerp(0.1, 0, st.warm * 2);
            st.end = ease(clamp01((y - (len - 1.1 * V)) / (0.9 * V)));
            break;
          }
        }
      }

      const show = (el: HTMLElement, o: number) => {
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0.001 ? "visible" : "hidden";
      };

      place(kitchen, kitchen.offsetWidth, kitchen.offsetHeight, fw, fh, st.kitchen.cam, "cover");
      show(kitchen, st.kitchen.o);
      for (const [el, s] of [
        [stove, st.stove],
        [fridge, st.fridge],
      ] as const) {
        if (s.o > 0) place(el, el.offsetWidth, el.offsetHeight, fw, fh, s.cam, close);
        show(el, s.o);
        el.dataset.on = s.o > 0.01 ? "1" : "0";
      }

      const dw = desk.offsetWidth;
      const dh = desk.offsetHeight;
      let deskAt = { tx: 0, ty: 0 };
      if (st.desk.o > 0) deskAt = place(desk, dw, dh, fw, fh, st.desk.cam, st.desk.edges);
      show(desk, st.desk.o);
      if (st.bed.o > 0) place(bed, bed.offsetWidth, bed.offsetHeight, fw, fh, st.bed.cam, st.bed.edges);
      show(bed, st.bed.o);

      // A touch of motion blur while the camera zooms fast (desktop only; filters are costly on phones).
      const lead = st.kitchen.o > 0.5 ? "kitchen" : st.desk.o > 0.5 ? "desk" : "bed";
      const leadS = st[lead].cam.s;
      const zoomSpeed = prev.layer === lead && dt > 0 ? Math.abs(leadS - prev.s) / dt : 0;
      prev = { layer: lead, s: leadS };
      const motion = desktop.matches && !reduce.matches ? Math.min(2, zoomSpeed * 0.5) : 0;
      const blur = Math.max(st.blur, motion);
      frame.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : "";

      // The screen is real DOM laid over the monitor, sized for its closest framing so it stays sharp
      // and only ever scales down.
      const want = { w: SCREEN.w * dw * S.monitor.s, h: SCREEN.h * dh * S.monitor.s };
      if (Math.abs(want.w - screenBase.w) > 0.5 || Math.abs(want.h - screenBase.h) > 0.5) {
        screenBase = want;
        screen.style.width = `${want.w.toFixed(1)}px`;
        screen.style.height = `${want.h.toFixed(1)}px`;
      }
      const cs = st.desk.cam.s;
      const sx = fw / 2 + deskAt.tx + (SCREEN.x - 0.5) * dw * cs;
      const sy = fh / 2 + deskAt.ty + (SCREEN.y - 0.5) * dh * cs;
      const k = screenBase.w > 0 ? (SCREEN.w * dw * cs) / screenBase.w : 1;
      screen.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) scale(${k.toFixed(4)})`;
      show(screen, st.screen.o * st.desk.o);
      screen.style.setProperty("--game", st.screen.game.toFixed(3));
      screen.style.setProperty("--voice", st.screen.voice.toFixed(3));
      screen.dataset.mode = st.screen.voice > 0.01 ? "voice" : st.screen.game > 0.01 ? "game" : "off";

      dark.style.opacity = st.night.toFixed(3);
      warm.style.opacity = st.warm.toFixed(3);
      end.style.opacity = st.end.toFixed(3);
    };

    const step = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = window.scrollY;
      // Snap on reduced motion and on long jumps (nav links, restored scroll) so the camera
      // doesn't fly through every room on the way. A snap isn't motion: no blur for it.
      if (reduce.matches || Math.abs(target - smoothY) > 2 * window.innerHeight) {
        smoothY = target;
        prev = { layer: "", s: 1 };
      } else {
        smoothY += (target - smoothY) * (1 - Math.exp(-dt * 9));
      }
      if (Math.abs(target - smoothY) < 0.5) smoothY = target;
      render(smoothY, dt);
      // Keep going until the camera has arrived and its motion blur has cleared.
      if (smoothY !== target || frame.style.filter !== "") raf = requestAnimationFrame(step);
      else last = 0;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    render(smoothY, 0);
    const ro = new ResizeObserver(remeasure);
    ro.observe(track);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    reduce.addEventListener("change", schedule);
    desktop.addEventListener("change", remeasure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      reduce.removeEventListener("change", schedule);
      desktop.removeEventListener("change", remeasure);
    };
  }, []);

  const seg = (id: Scene) => (el: HTMLElement | null) => {
    segRefs.current[id] = el;
  };

  const plate = (ratio: number) => ({ "--ratio": ratio }) as SceneVars;

  return (
    <section className={h.house}>
      <div className={h.stage} aria-hidden="true">
        <div ref={frameRef} className={h.frame}>
          <div ref={kitchenRef} className={h.layer} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/house-kitchen.webp" alt="" width={2048} height={1152} priority />
            <div className={h.lamp} />
          </div>
          <div ref={stoveRef} className={`${h.layer} ${h.close}`} style={plate(1392 / 752)} data-on="0">
            <Image className={h.img} src="/night/house-stove.webp" alt="" width={1392} height={752} />
            <StoveFx />
          </div>
          <div ref={fridgeRef} className={`${h.layer} ${h.close}`} style={plate(1392 / 752)} data-on="0">
            <Image className={h.img} src="/night/house-fridge.webp" alt="" width={1392} height={752} />
            <FridgeFx t={t} layerRef={fridgeRef} />
          </div>
          <div ref={deskRef} className={`${h.layer} ${h.later}`} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/house-desk.webp" alt="" width={2048} height={1152} />
          </div>
          <div ref={bedRef} className={`${h.layer} ${h.later}`} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/bedroom.webp" alt="" width={2048} height={1152} />
          </div>
          <div ref={screenRef} className={h.screen} data-mode="off">
            <WithdrawalReel />
            <VoiceCloud screenRef={screenRef} />
            <div className={h.screenGlass} />
          </div>
          <div ref={darkRef} className={h.dark} />
          <div ref={warmRef} className={h.warm} />
        </div>
        <div className={h.scrim} />
        <div ref={endRef} className={h.endFade} />
      </div>

      <div ref={trackRef} className={h.track}>
        <div ref={seg("intro")} className={h.segIntro} data-hour="20:00" data-tone="dark">
          {intro}
        </div>
        <div ref={seg("work")} id="work" className={h.segWork} data-hour="20:00" data-tone="dark">
          {workIntro}
        </div>
        {HOUSE_PROJECTS.slice(0, 2).map((p) => (
          <ProjectCard key={p.scene} {...p} t={t} segRef={seg(p.scene)} />
        ))}
        <div ref={seg("walk")} className={h.segWalk} data-hour="00:00" data-tone="dark" />
        {HOUSE_PROJECTS.slice(2).map((p) => (
          <ProjectCard key={p.scene} {...p} t={t} segRef={seg(p.scene)} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  scene,
  project: proj,
  hour,
  vars,
  t,
  segRef,
}: {
  scene: ProjectScene;
  project: Project;
  hour: string;
  vars: SceneVars;
  t: Translate;
  segRef: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={segRef}
      className={h.segProject}
      aria-labelledby={`${proj.id}-title`}
      data-hour={hour}
      data-tone="dark"
    >
      <div className={h.card} style={vars}>
        <p className={ns.hour} data-reveal="">
          {hour} — {t(strings.night.hours[scene])}
        </p>
        <h3 id={`${proj.id}-title`} className={ns.cardTitle} data-reveal="">
          {proj.name}
        </h3>
        <p className={ns.tagline} data-reveal="">
          {t(proj.tagline)}
        </p>
        <ProjectMeta proj={proj} t={t} />
        <ProjectDetails proj={proj} t={t} />
      </div>
    </article>
  );
}

const PUFFS: { left: string; delay: string; dx: string }[] = [
  { left: "30%", delay: "0s", dx: "0%" },
  { left: "16%", delay: "0.8s", dx: "-22%" },
  { left: "44%", delay: "1.6s", dx: "18%" },
  { left: "24%", delay: "2.4s", dx: "-8%" },
  { left: "38%", delay: "3.2s", dx: "12%" },
];

const SPARKS: { left: string; top: string; delay: string }[] = [
  { left: "22%", top: "60%", delay: "0s" },
  { left: "48%", top: "40%", delay: "0.35s" },
  { left: "70%", top: "55%", delay: "0.7s" },
  { left: "36%", top: "30%", delay: "0.15s" },
  { left: "60%", top: "70%", delay: "0.9s" },
  { left: "82%", top: "35%", delay: "0.5s" },
];

function StoveFx() {
  return (
    <>
      <div className={h.flame} />
      <div className={h.sizzle}>
        {SPARKS.map((sp) => (
          <span
            key={sp.left + sp.top}
            className={h.spark}
            style={{ left: sp.left, top: sp.top, animationDelay: sp.delay }}
          />
        ))}
      </div>
      <div className={h.steam}>
        {PUFFS.map((pf) => (
          <span
            key={pf.left}
            className={h.puff}
            style={{ left: pf.left, animationDelay: pf.delay, "--dx": pf.dx } as SceneVars}
          />
        ))}
      </div>
    </>
  );
}

// Item boxes on the open-fridge plate (fractions of the 1392×752 image), in the order of
// `strings.night.fridge.items`: milk, tomatoes, cheese, lettuce.
const FRIDGE_ITEMS: { x: number; y: number; w: number; h: number }[] = [
  { x: 0.379, y: 0.263, w: 0.052, h: 0.176 },
  { x: 0.368, y: 0.658, w: 0.067, h: 0.102 },
  { x: 0.413, y: 0.652, w: 0.108, h: 0.093 },
  { x: 0.442, y: 0.775, w: 0.096, h: 0.113 },
];

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/**
 * Illustrates Heladera's core loop — items get picked and ticked off while "Faltan N" counts down.
 * Steps advance only while the fridge plate is on screen. Cycle: select item i (2i), tick it (2i+1),
 * then two beats with everything bought before starting over.
 */
function FridgeFx({ t, layerRef }: { t: Translate; layerRef: React.RefObject<HTMLDivElement | null> }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (layerRef.current?.dataset.on === "1") setStep((n) => (n + 1) % 10);
    }, 1100);
    return () => window.clearInterval(id);
  }, [layerRef]);

  const total = FRIDGE_ITEMS.length;
  const selected = step < 2 * total ? Math.floor(step / 2) : -1;
  const ticked = step < 2 * total ? Math.floor((step + 1) / 2) : total;
  const labels = strings.night.fridge.items;

  return (
    <>
      <div className={h.fridgeGlow} />
      <div className={h.counter}>
        {t(strings.night.fridge.toBuy)} <b>{total - ticked}</b>
      </div>
      {FRIDGE_ITEMS.map((it, i) => {
        const style: React.CSSProperties = {
          left: pct(it.x),
          top: pct(it.y),
          width: pct(it.w),
          height: pct(it.h),
        };
        const isSel = i === selected;
        return (
          <React.Fragment key={i}>
            <div
              className={h.sprite}
              data-selected={isSel}
              style={{
                ...style,
                backgroundSize: `${(100 / it.w).toFixed(2)}% ${(100 / it.h).toFixed(2)}%`,
                backgroundPosition: `${((it.x / (1 - it.w)) * 100).toFixed(2)}% ${((it.y / (1 - it.h)) * 100).toFixed(2)}%`,
              }}
            />
            <div className={h.box} data-on={isSel} style={style}>
              <span className={h.label}>
                <span className={h.check} data-done={i < ticked}>
                  ✓
                </span>
                {t(labels[i])}
              </span>
            </div>
            {i < ticked && !isSel && (
              <span className={h.tick} style={{ left: pct(it.x + it.w), top: pct(it.y) }} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

// Real in-game captures from Withdrawal (Unity 6), cropped to 16:9.
const REEL = [1, 2, 3, 4, 5].map((n) => `/night/withdrawal-${n}.webp`);

/** The game playing on the monitor: the captures cycle with a VHS flicker between them. */
function WithdrawalReel() {
  return (
    <div className={h.reel}>
      {REEL.map((src, i) => (
        <Image
          key={src}
          className={h.reelShot}
          src={src}
          alt=""
          width={1280}
          height={720}
          style={{ animationDelay: `${i * 2.4}s` }}
        />
      ))}
      <div className={h.scanlines} />
    </div>
  );
}

/**
 * JARVIS has no interface, so this is a representation, not a capture: a point cloud that breathes
 * and ripples as if speaking. It only draws while the screen is in "voice" mode.
 */
function VoiceCloud({ screenRef }: { screenRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 1100;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, ph: (i * 7.31) % (Math.PI * 2) };
    });

    let raf = 0;
    let timer = 0;
    let w = 0;
    let hgt = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      hgt = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(hgt * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = (now: number) => {
      const t = reduce ? 2 : now / 1000;
      ctx.clearRect(0, 0, w, hgt);
      // Speech-like envelope: syllables inside phrases, with pauses between phrases.
      const phrase = clamp01(Math.sin(t * 0.85) * 1.6 + 0.4);
      const syllable = 0.5 + 0.5 * Math.sin(t * 9.2) * Math.sin(t * 3.1 + 1);
      const amp = 0.04 + 0.2 * phrase * syllable;
      const breathe = 1 + 0.035 * Math.sin(t * 1.3);
      const R = Math.min(w, hgt) * 0.3 * breathe;
      const ry = t * 0.32;
      const rx = 0.42;
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      ctx.globalCompositeOperation = "lighter";
      for (const p of pts) {
        const ripple = Math.sin(p.y * 6 + t * 4.2 + p.ph * 0.3) * Math.cos(p.x * 4 - t * 2.6);
        const k = 1 + amp * ripple;
        let x = p.x * k;
        let y = p.y * k;
        let z = p.z * k;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        x = x1;
        y = y1;
        z = z2;
        const persp = 2.6 / (2.6 + z);
        const depth = (1 - z) / 2;
        const size = (0.7 + 1.3 * depth) * persp;
        ctx.fillStyle = `rgba(${Math.round(110 + 80 * depth)}, ${Math.round(200 + 40 * depth)}, 255, ${(0.18 + 0.6 * depth).toFixed(3)})`;
        ctx.fillRect(w / 2 + x * R * persp, hgt / 2 + y * R * persp, size, size);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (screenRef.current?.dataset.mode === "voice") {
        draw(now);
        raf = requestAnimationFrame(loop);
      } else {
        // Idle: check back a few times a second instead of drawing every frame.
        timer = window.setTimeout(() => (raf = requestAnimationFrame(loop)), 250);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [screenRef]);

  return <canvas ref={canvasRef} className={h.voice} />;
}
