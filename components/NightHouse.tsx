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
type Scene = "intro" | "work" | "walk" | ProjectScene | "dawn";
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
// (0.385, 0.50). Close-ups: pan (0.47, 0.60), fridge interior (0.615, 0.76; the open fridge
// fills only the lower right of its plate, so its framings zoom in further). Desk: monitor centre
// (0.492, 0.542). Bedroom: window and bed (0.6, 0.5). On desktop the subject sits right of centre so
// the cards on the left never cover it.
const DESKTOP: Shots = {
  hero: shot(0.45, 0.55, 0.62, 0.5, 1.12),
  base: shot(0.42, 0.55, 0.58, 0.5, 1.08),
  stove: shot(0.17, 0.6, 0.68, 0.5, 2.8),
  stoveIn: shot(0.47, 0.62, 0.68, 0.5, 1.3),
  stoveHold: shot(0.47, 0.62, 0.68, 0.5, 1.06),
  fridge: shot(0.555, 0.58, 0.68, 0.5, 2.4),
  // Aimed a little low so the milk's label clears the nav.
  fridgeIn: shot(0.615, 0.76, 0.68, 0.55, 1.7),
  fridgeHold: shot(0.615, 0.76, 0.68, 0.55, 1.45),
  door: shot(0.385, 0.5, 0.5, 0.5, 4.2),
  deskBase: shot(0.5, 0.55, 0.6, 0.5, 1.08),
  monitor: shot(0.492, 0.542, 0.7, 0.5, 2.6),
  bed: shot(0.6, 0.5, 0.62, 0.5, 1.1),
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
  stoveIn: shot(0.47, 0.6, 0.5, 0.45, 1.15),
  stoveHold: shot(0.47, 0.6, 0.5, 0.45, 1),
  fridge: shot(0.555, 0.56, 0.5, 0.47, 2.1),
  // The four items span 37.5% of the plate's height; at 1.36× they fit between the nav and the
  // parked card (the clear band is ~12–67% of the frame), aimed at its middle.
  fridgeIn: shot(0.625, 0.76, 0.5, 0.405, 1.56),
  fridgeHold: shot(0.625, 0.76, 0.5, 0.405, 1.36),
  door: shot(0.385, 0.5, 0.5, 0.5, 3.5),
  deskBase: shot(0.49, 0.55, 0.5, 0.47, 1.1),
  monitor: shot(0.492, 0.542, 0.5, 0.47, 1.9),
  bed: shot(0.62, 0.5, 0.5, 0.5, 1),
};

/** The monitor's screen on the desk plate (fractions of the image, so any resolution of it works). */
const SCREEN = { x: 0.4195, y: 0.4713, w: 0.1442, h: 0.1407 };

/**
 * The camera moves through the house: one continuous Kling 3.0 Omni take per transition, scrubbed by
 * scroll (forwards on the way in, backwards on the way out). The kitchen takes start from the wide
 * kitchen plate alone (the walk is pinned to the desk frame at its end as well); the turn to the bed
 * starts from the desk frame, and the dawn time-lapse from the bed frame, with the camera locked
 * off. Each take's last frame is the plate it hands over to (stove, fridge, desk, bedroom, dawn), so
 * the camera really travels through one house and the stills never jump. Interpolated from 24 to 60 fps and encoded with every frame a
 * keyframe, so any frame decodes on its own and a seek lands in one paint. Desktop gets 1080p; phones
 * get a "tall" 720p cut (1280×1260) with each frame's blurred continuation baked in below it, the
 * moving counterpart of the stills' .ext. Until a clip is loaded (or with reduced motion / data
 * saver) the CSS zoom over the stills plays instead.
 */
const CLIPS: Partial<Record<Scene, string>> = {
  remy: "take-stove",
  heladera: "take-fridge",
  walk: "take-walk",
  sleepsync: "take-bed",
  dawn: "take-dawn",
};
const CLIP_FPS = 60;

// How much scroll each camera move takes, in screen heights. The renderer and the camera's speed
// limit (see `moves`) both read these, so they agree on where the camera is travelling.
const ZOOM_IN = 0.75;
const ZOOM_OUT_AT = 0.95; // the zoom-out starts this far before its segment ends…
const ZOOM_OUT = 0.8; // …and takes this long
const GAME_IN_AT = 0.3; // Withdrawal's zoom waits for the desk to fade in from the hallway
const TURN = 0.7;
const DAWN = 0.9;

// A fast scroll (a trackpad or wheel flick, a phone fling) crosses a whole scene in a fraction of a
// second, and a camera that followed it jumped from still to still with the take in between reduced
// to a frame or two. While it travels, each camera move takes at least MIN_MOVE seconds however fast
// the page goes, so it plays as motion; a normal read is slower than that and never feels it. Once the
// camera falls more than CATCH_UP screens behind it hurries, so a long fling isn't followed by a slow
// tour of every room, but never past FAST_MOVE per move, so every move is still seen.
const MIN_MOVE = 0.75;
const FAST_MOVE = 0.15;
const CATCH_UP = 1.5;
// A take only shows the frames it has decoded, and a phone needs several screen frames per seek: a
// camera that outran it skipped most of the take, which is what still looked like a jump on phones.
// Inside a take's move the camera stays within 1/FRAMES_PER_MOVE of the move of the frame last asked
// for, so any move shows at least that many frames however slow the decoder; a seek that hangs for
// SEEK_GIVE_UP ms stops holding it back. Desktop decoders keep up and never feel it.
const FRAMES_PER_MOVE = 16;
const SEEK_GIVE_UP = 250;

/** Where in a segment the camera travels between stills, as [from, to] scroll offsets. */
function moves(id: Scene, len: number, V: number): [number, number][] {
  const zoomOut: [number, number] = [len - ZOOM_OUT_AT * V, len - (ZOOM_OUT_AT - ZOOM_OUT) * V];
  switch (id) {
    case "remy":
    case "heladera":
    case "jarvis":
      return [[0, ZOOM_IN * V], zoomOut];
    case "withdrawal":
      return [[0, (GAME_IN_AT + ZOOM_IN) * V], zoomOut];
    case "walk":
      return [[0, len - V]];
    case "sleepsync":
      return [[0, TURN * V]];
    case "dawn":
      return [[0, DAWN * V]];
    default:
      return [];
  }
}

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
 * The plate centre's offset from the frame centre that frames `cam` inside a frame of `fw`×`fh`
 * for a plate of `w`×`h` (unscaled).
 */
function frameFor(w: number, h: number, fw: number, fh: number, cam: Shot, edges: Edges) {
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
  return { tx, ty };
}

function apply(el: HTMLElement, tx: number, ty: number, s: number) {
  el.style.transform = `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
}

/** Writes the transform that frames `cam` (see frameFor) and returns the offset it used. */
function place(el: HTMLElement, w: number, h: number, fw: number, fh: number, cam: Shot, edges: Edges) {
  const at = frameFor(w, h, fw, fh, cam, edges);
  apply(el, at.tx, at.ty, cam.s);
  return at;
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

const ORDER: Scene[] = ["intro", "work", "remy", "heladera", "walk", "withdrawal", "jarvis", "sleepsync", "dawn"];

/** The projects in the order the night visits them, for the chapter menu and the project list. */
export const HOUSE_CHAPTERS = HOUSE_PROJECTS.map(({ project, hour }) => ({ project, hour }));

type Props = {
  t: Translate;
  /** The 20:00 opening (name, photo, intro) laid over the wide kitchen shot. */
  intro: React.ReactNode;
  /** "Selected work" statement shown before the camera starts moving. */
  workIntro: React.ReactNode;
  /** The 06:00 heading that closes the night over the bedroom at dawn (the About section's title). */
  dawn: React.ReactNode;
};

export default function NightHouse({ t, intro, workIntro, dawn: dawnIntro }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const kitchenRef = useRef<HTMLDivElement>(null);
  const stoveRef = useRef<HTMLDivElement>(null);
  const fridgeRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const bedRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segRefs = useRef<Partial<Record<Scene, HTMLElement | null>>>({});
  const clipRefs = useRef<Partial<Record<Scene, HTMLVideoElement | null>>>({});
  // The layer each clip lives in; the camera moves this, and on phones the tall video hangs below it.
  const clipLayerRefs = useRef<Partial<Record<Scene, HTMLDivElement | null>>>({});
  const clipReady = useRef<Partial<Record<Scene, boolean>>>({});

  // Load each transition clip only when its scene is getting close, and never with reduced
  // motion or data saver on. Crossing the desktop/phone breakpoint later (a tablet turning) swaps
  // the loaded clips for the other cut, so phones never show a clip without its continuation.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const desktop = window.matchMedia("(min-width: 900px)");
    const wanted = new Set<Scene>();

    const load = (scene: Scene) => {
      const video = clipRefs.current[scene];
      const name = CLIPS[scene];
      if (!video || !name) return;
      clipReady.current[scene] = false;
      video.addEventListener(
        "loadeddata",
        () => {
          // iOS Safari only paints seeked frames once the video has played; muted inline
          // playback is allowed without a gesture. If it's refused, the stills stay in charge.
          video
            .play()
            .then(() => {
              video.pause();
              // Read from the source actually loaded, in case the cut was swapped mid-load.
              video.dataset.tall = video.currentSrc.endsWith("-720.mp4") ? "1" : "0";
              clipReady.current[scene] = true;
              window.dispatchEvent(new Event("scroll"));
            })
            .catch(() => undefined);
        },
        { once: true },
      );
      video.src = `/night/clips/${name}-${desktop.matches ? "1080" : "720"}.mp4`;
      video.load();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const scene = (entry.target as HTMLElement).dataset.scene as Scene;
          wanted.add(scene);
          load(scene);
        }
      },
      { rootMargin: "150% 0px" },
    );
    for (const scene of Object.keys(CLIPS) as Scene[]) {
      const el = segRefs.current[scene];
      if (el) io.observe(el);
    }
    const swap = () => wanted.forEach(load);
    desktop.addEventListener("change", swap);
    return () => {
      io.disconnect();
      desktop.removeEventListener("change", swap);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const kitchen = kitchenRef.current;
    const stove = stoveRef.current;
    const fridge = fridgeRef.current;
    const desk = deskRef.current;
    const bed = bedRef.current;
    const dawn = dawnRef.current;
    const screen = screenRef.current;
    const dark = darkRef.current;
    const scrim = scrimRef.current;
    const end = endRef.current;
    if (!stage || !frame || !kitchen || !stove || !fridge || !desk || !bed || !dawn || !screen || !dark || !scrim || !end) {
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    let raf = 0;
    let screenBase = { w: 0, h: 0 };

    // Segment positions in page coordinates, re-measured whenever the track's layout changes
    // (resize, fonts, a card's details opening on mobile) instead of on every frame.
    let segs: { id: Scene; top: number; height: number }[] = [];
    // The camera moves in page coordinates, for the speed limit.
    let spans: [number, number][] = [];
    const measure = () => {
      segs = ORDER.flatMap((id) => {
        const el = segRefs.current[id];
        if (!el) return [];
        const r = el.getBoundingClientRect();
        return [{ id, top: r.top + window.scrollY, height: r.height }];
      });
      const V = stage.clientHeight;
      spans = segs.flatMap((sg) => moves(sg.id, sg.height, V).map(([a, b]): [number, number] => [sg.top + a, sg.top + b]));
    };

    // The camera follows a damped copy of the scroll position, so wheel notches and
    // trackpad flicks become one continuous move instead of a series of jumps.
    let smoothY = window.scrollY;
    let lastTarget = smoothY;
    let last = 0;
    // The take move on screen ([a, b] in page coordinates) and the camera position its last seek asked
    // for, at `time` (see FRAMES_PER_MOVE).
    let seekLock: { a: number; b: number; y: number; time: number } | null = null;
    // A nav link scrolls smoothly across the whole house; the camera snaps along with it.
    let jumping = false;
    let jumpTimer = 0;
    const endJumpIn = (ms: number) => {
      window.clearTimeout(jumpTimer);
      jumpTimer = window.setTimeout(() => (jumping = false), ms);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('a[href^="#"]')) return;
      jumping = true;
      endJumpIn(400);
    };

    const render = (Y: number) => {
      const base = desktop.matches ? DESKTOP : MOBILE;
      const S = reduce.matches ? still(base) : base;
      // The stage is 100svh, the same unit the segments are laid out in. window.innerHeight grows
      // and shrinks with the phone's URL bar, which made the camera jump mid-scene.
      const V = stage.clientHeight;
      const fw = frame.clientWidth;
      const fh = frame.clientHeight;
      const close: Edges = desktop.matches ? "allowLeft" : "allowBottom";
      // The bed as SleepSync leaves it (after its slow push), where the dawn time-lapse is framed too.
      const bedEnd: Shot = { ...S.bed, s: S.bed.s + (reduce.matches ? 0 : 0.04) };

      // Everything the frame shows; each scene below overrides what it needs.
      const st = {
        kitchen: { cam: S.hero, o: 1 },
        stove: { cam: S.stoveHold, o: 0 },
        fridge: { cam: S.fridgeHold, o: 0 },
        desk: { cam: S.deskBase, o: 0, edges: "cover" as Edges },
        bed: { cam: S.bed, o: 0, edges: "cover" as Edges },
        dawn: 0,
        screen: { o: 0, game: 0, voice: 0 },
        // lift: 0 frames the clip like the wide plates (cover), 1 like the close-ups (`close`).
        clip: null as null | { scene: Scene; cam: Shot; o: number; lift: number; t: number },
        night: 0,
        scrim: 1,
        end: 0,
        blur: 0,
      };

      // A transition clip that's loaded and allowed to play, or null to fall back to the stills.
      const readyClip = (scene: Scene) => {
        const c = clipRefs.current[scene];
        return c && clipReady.current[scene] && !reduce.matches && c.duration > 0 ? c : null;
      };
      // Clip opacity: in right away (its first frame matches the still underneath), out once the
      // still that matches its last frame has fully covered it.
      const clipOpacity = (k: number) => clamp01(k / 0.03) * (1 - clamp01((k - 0.98) / 0.02));
      const clipTime = (c: HTMLVideoElement, k: number) => k * Math.max(0, c.duration - 0.05);

      const seg = segs.find((sg) => Y >= sg.top && Y < sg.top + sg.height);
      const active = seg?.id;
      // The camera move Y is in, in page coordinates, for the seek lock.
      const move = seg && moves(seg.id, seg.height, V).find(([a, b]) => Y - seg.top >= a && Y - seg.top <= b);

      if (!seg || !active) {
        // Past the house: hold the last frame (the bedroom at dawn, melted into cream at the bottom).
        if (segs.length > 0 && Y >= segs[0].top) {
          st.kitchen.o = 0;
          st.dawn = 1;
          st.scrim = 0;
          st.end = 1;
        }
      } else {
        const y = Y - seg.top;
        const len = seg.height;
        const p = clamp01(y / len);
        // Shared rhythm for project scenes: zoom in over ~¾ screen, hold while the card scrolls, zoom out.
        const zIn = ease(clamp01(y / (ZOOM_IN * V)));
        const zOut = ease(clamp01((y - (len - ZOOM_OUT_AT * V)) / (ZOOM_OUT * V)));
        const hold = clamp01((y - ZOOM_IN * V) / Math.max(1, len - (ZOOM_IN + ZOOM_OUT_AT) * V));

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
            const isRemy = active === "remy";
            const holdShot = isRemy ? S.stoveHold : S.fridgeHold;
            const clip = readyClip(active);
            if (clip) {
              // The clip is the camera: its first frame is the kitchen framed at `base`, its last the
              // close-up framed at the hold shot, so the stills hand over without a jump at both ends.
              st.kitchen.cam = S.base;
              // Once the clip is opaque the wide plate under it is hidden: it would only peek out
              // where the clip slides aside (its masked left edge on desktop, its bottom on phones).
              st.kitchen.o = z < 0.03 ? 1 : 0;
              // The still matches the clip's last frame, so it only takes over at the very end (any
              // earlier and it would ghost over the moving clip), and it's opaque before the clip fades.
              const reveal = clamp01((z - 0.96) / 0.02);
              const cam = { ...holdShot };
              if (!reduce.matches) cam.s += 0.05 * hold * reveal;
              st[isRemy ? "stove" : "fridge"] = { cam, o: reveal };
              st.clip = { scene: active, cam: mix(S.base, holdShot, z), o: clipOpacity(z), lift: z, t: clipTime(clip, z) };
            } else {
              const reveal = clamp01((z - 0.55) / 0.4);
              st.kitchen.cam = mix(S.base, isRemy ? S.stove : S.fridge, z);
              const cam = mix(isRemy ? S.stoveIn : S.fridgeIn, holdShot, reveal);
              if (!reduce.matches) cam.s += 0.05 * hold * reveal;
              st[isRemy ? "stove" : "fridge"] = { cam, o: reveal };
            }
            st.night = isRemy ? lerp(0.03, 0.07, p) : lerp(0.07, 0.15, p);
            break;
          }
          case "walk": {
            const w = ease(clamp01(y / Math.max(1, len - V)));
            const clip = readyClip("walk");
            if (clip) {
              // Through the hallway door and into the bedroom: the clip walks from the kitchen to the desk,
              // and the desk plate (its last frame) takes over at the very end, as with the close-ups.
              st.kitchen.cam = S.base;
              st.kitchen.o = w < 0.03 ? 1 : 0;
              st.desk = { cam: S.deskBase, o: clamp01((w - 0.96) / 0.02), edges: "cover" };
              st.clip = { scene: "walk", cam: mix(S.base, S.deskBase, w), o: clipOpacity(w), lift: 0, t: clipTime(clip, w) };
              st.night = lerp(0.15, 0.06, w);
            } else {
              // Fallback: push into the door while the house goes dark.
              st.kitchen.cam = mix(S.base, S.door, w);
              st.night = lerp(0.15, 1, Math.pow(w, 1.6));
            }
            break;
          }
          case "withdrawal":
          case "jarvis": {
            // The bedroom desk. Withdrawal fades in from the dark hallway (unless the walk clip already
            // brought us here); the screen turns on as the camera reaches it and goes dark again on the
            // way out ("the PC dims, we stay in the room").
            const isGame = active === "withdrawal";
            const fadeIn = isGame && !readyClip("walk") ? ease(clamp01(y / (0.45 * V))) : 1;
            const zi = isGame ? ease(clamp01((y - GAME_IN_AT * V) / (ZOOM_IN * V))) : zIn;
            const z = zi * (1 - zOut);
            st.kitchen.o = 0;
            st.desk = { cam: mix(S.deskBase, S.monitor, z), o: 1, edges: "cover" };
            const on = clamp01((zi - 0.35) / 0.35) * (1 - clamp01(zOut / 0.5));
            st.screen = {
              // After JARVIS the overlay fades away so the monitor shows the plate's own glow — the
              // first frame of the turnaround clip — instead of jumping from a black screen to it.
              o: isGame
                ? clamp01((zi - 0.15) / 0.3)
                : 1 - (readyClip("sleepsync") ? clamp01((zOut - 0.5) / 0.5) : 0),
              game: isGame ? on : 0,
              voice: isGame ? 0 : on,
            };
            st.night = isGame ? lerp(1, 0.06, fadeIn) : 0.08;
            break;
          }
          case "sleepsync": {
            const turn = ease(clamp01(y / (TURN * V)));
            st.kitchen.o = 0;
            const clip = readyClip("sleepsync");
            if (clip) {
              // The clip turns the camera from the desk to the bed. It sits under the desk plate in the
              // DOM, so the desk (identical to its first frame) fades out as the clip fades in.
              const o = clipOpacity(turn);
              st.desk = { cam: S.deskBase, o: turn > 0.5 ? 0 : 1 - o, edges: "cover" };
              const bedCam = { ...S.bed };
              if (!reduce.matches) bedCam.s += 0.04 * hold;
              st.bed = { cam: bedCam, o: clamp01((turn - 0.96) / 0.02), edges: "cover" };
              st.screen = { o: 0, game: 0, voice: 0 };
              st.clip = { scene: "sleepsync", cam: mix(S.deskBase, S.bed, turn), o, lift: 0, t: clipTime(clip, turn) };
            } else {
              // Fallback: the desk whips off to the left and the bed swings in from the right.
              st.desk = { cam: nudge(S.deskBase, -0.45 * turn), o: 1 - turn, edges: "free" };
              const bedCam = nudge(S.bed, 0.45 * (1 - turn));
              if (!reduce.matches) bedCam.s += 0.04 * hold;
              st.bed = { cam: bedCam, o: turn, edges: turn < 1 ? "free" : "cover" };
              st.screen = { o: 1 - turn, game: 0, voice: 0 };
              st.blur = reduce.matches ? 0 : Math.sin(Math.PI * turn) * 9;
            }
            st.night = 0.1;
            break;
          }
          case "dawn": {
            // 06:00: the camera stays on the bed while the time-lapse turns the night into sunrise, then
            // the bottom of the frame melts into the cream of the About section under the heading.
            const d = ease(clamp01(y / (DAWN * V)));
            st.kitchen.o = 0;
            const clip = readyClip("dawn");
            if (clip) {
              // Same hand-offs as the turnaround: the bed (the clip's first frame) sits above it and fades
              // out as it fades in; the dawn plate (its last frame) covers it at the very end.
              const o = clipOpacity(d);
              st.bed = { cam: bedEnd, o: d > 0.5 ? 0 : 1 - o, edges: "cover" };
              st.dawn = clamp01((d - 0.96) / 0.02);
              st.clip = { scene: "dawn", cam: bedEnd, o, lift: 0, t: clipTime(clip, d) };
            } else {
              st.bed = { cam: bedEnd, o: 1, edges: "cover" };
              st.dawn = d;
            }
            st.night = lerp(0.1, 0, d);
            // The cards' scrim has nothing left to shade, and it would muddy the morning light.
            st.scrim = 1 - d;
            // The melt into cream finishes before the stage starts scrolling away (the last screen of the
            // segment), so its bottom edge is already the About section's colour when it leaves.
            st.end = ease(clamp01((y - DAWN * V) / Math.max(1, len - (DAWN + 1) * V)));
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
      const moveA = seg && move ? seg.top + move[0] : NaN;
      if (!st.clip || st.clip.o <= 0 || !move || seekLock?.a !== moveA) seekLock = null;
      for (const [scene, video] of Object.entries(clipRefs.current) as [Scene, HTMLVideoElement | null][]) {
        const layer = clipLayerRefs.current[scene];
        if (!video || !layer) continue;
        const c = st.clip?.scene === scene ? st.clip : null;
        if (c && c.o > 0) {
          // Blend between the two clamps instead of switching, so the framing never jumps: the clip
          // starts exactly where the wide plate is and ends exactly where the close-up takes over.
          const vw = layer.offsetWidth;
          const vh = layer.offsetHeight;
          const a = frameFor(vw, vh, fw, fh, c.cam, "cover");
          const b = c.lift > 0 ? frameFor(vw, vh, fw, fh, c.cam, close) : a;
          apply(layer, lerp(a.tx, b.tx, c.lift), lerp(a.ty, b.ty, c.lift), c.cam.s);
          // One seek at a time: a new seek cancels the pending one before its frame is painted, so on
          // fast screens most frames were skipped. The `seeked` listener re-renders to catch up.
          if (!video.seeking && Math.abs(video.currentTime - c.t) > 0.5 / CLIP_FPS) {
            video.currentTime = c.t;
            if (seg && move) seekLock = { a: moveA, b: seg.top + move[1], y: Y, time: performance.now() };
          }
        }
        show(layer, c ? c.o : 0);
      }
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
      if (st.dawn > 0) place(dawn, dawn.offsetWidth, dawn.offsetHeight, fw, fh, bedEnd, "cover");
      show(dawn, st.dawn);

      // Only the no-clip turnaround blurs. (Zooms used to get a speed-based motion blur too, but a
      // filter over the whole frame re-composites every layer each frame and hitches as it toggles.)
      frame.style.filter = st.blur > 0.25 ? `blur(${st.blur.toFixed(2)}px)` : "";

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
      scrim.style.opacity = st.scrim.toFixed(3);
      end.style.opacity = st.end.toFixed(3);
    };

    // Inside a camera move, a step is held to the move's speed limit (see MIN_MOVE); on the way to the
    // next move it stops at its start, so no move is entered at full speed.
    const limit = (y: number, d: number, gap: number, dt: number, V: number) => {
      const down = d > 0;
      const span = spans.find(([a, b]) => (down ? y >= a && y < b : y > a && y <= b));
      if (span) {
        const len = span[1] - span[0];
        const speed = Math.min((len / MIN_MOVE) * Math.max(1, Math.abs(gap) / (CATCH_UP * V)), len / FAST_MOVE);
        return Math.max(-speed * dt, Math.min(speed * dt, d));
      }
      for (const [a, b] of spans) {
        if (down && y < a && y + d > a) d = a - y;
        if (!down && y > b && y + d < b) d = b - y;
      }
      return d;
    };

    const step = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = window.scrollY;
      const V = stage.clientHeight;
      const gap = target - smoothY;
      // Snap on reduced motion, while a nav link scrolls the page, and on instant jumps (restored
      // scroll, Home/End) so the camera doesn't fly through every room on the way.
      if (reduce.matches || jumping || Math.abs(target - lastTarget) > 1.5 * V) {
        smoothY = target;
      } else {
        const d = gap * (1 - Math.exp(-dt * 9));
        let next = smoothY + limit(smoothY, d, gap, dt, V);
        const lock = seekLock;
        if (lock && now - lock.time < SEEK_GIVE_UP && next >= lock.a && next <= lock.b) {
          const lead = (lock.b - lock.a) / FRAMES_PER_MOVE;
          next = Math.max(lock.y - lead, Math.min(lock.y + lead, next));
        }
        smoothY = next;
      }
      lastTarget = target;
      if (Math.abs(target - smoothY) < 0.5) smoothY = target;
      render(smoothY);
      // Keep going until the camera has arrived.
      if (smoothY !== target) raf = requestAnimationFrame(step);
      else last = 0;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onScroll = () => {
      // The nav jump is over once the smooth scroll stops.
      if (jumping) endJumpIn(200);
      schedule();
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    render(smoothY);
    const ro = new ResizeObserver(remeasure);
    ro.observe(track);
    const videos = Object.values(clipRefs.current).filter((v): v is HTMLVideoElement => !!v);
    for (const v of videos) v.addEventListener("seeked", schedule);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    document.addEventListener("click", onClick);
    reduce.addEventListener("change", schedule);
    desktop.addEventListener("change", remeasure);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(jumpTimer);
      ro.disconnect();
      for (const v of videos) v.removeEventListener("seeked", schedule);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
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
      <div ref={stageRef} className={h.stage} aria-hidden="true">
        <div ref={frameRef} className={h.frame}>
          <div ref={kitchenRef} className={h.layer} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/house-kitchen.webp" alt="" width={4096} height={2304} priority />
            <Ext plate="house-kitchen" />
            <div className={h.lamp} />
          </div>
          {(Object.keys(CLIPS) as Scene[]).map((scene) => (
            <div
              key={scene}
              ref={(el) => {
                clipLayerRefs.current[scene] = el;
              }}
              className={`${h.layer} ${h.clip}`}
              style={plate(16 / 9)}
            >
              <video
                ref={(el) => {
                  clipRefs.current[scene] = el;
                }}
                className={h.clipVideo}
                muted
                playsInline
                preload="none"
              />
            </div>
          ))}
          <div ref={stoveRef} className={`${h.layer} ${h.close}`} style={plate(16 / 9)} data-on="0">
            <Image className={h.img} src="/night/house-stove.webp" alt="" width={1920} height={1080} />
            <Ext plate="house-stove" />
            <StoveFx />
          </div>
          <div ref={fridgeRef} className={`${h.layer} ${h.close}`} style={plate(16 / 9)} data-on="0">
            <Image className={h.img} src="/night/house-fridge.webp" alt="" width={1920} height={1080} />
            <Ext plate="house-fridge" />
            <FridgeFx t={t} layerRef={fridgeRef} />
          </div>
          <div ref={deskRef} className={`${h.layer} ${h.later}`} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/house-desk.webp" alt="" width={1920} height={1080} />
            <Ext plate="house-desk" />
          </div>
          <div ref={bedRef} className={`${h.layer} ${h.later}`} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/bedroom.webp" alt="" width={1920} height={1080} />
            <Ext plate="bedroom" />
          </div>
          <div ref={dawnRef} className={`${h.layer} ${h.later}`} style={plate(16 / 9)}>
            <Image className={h.img} src="/night/dawn.webp" alt="" width={1920} height={1080} />
            <Ext plate="dawn" />
          </div>
          <div ref={screenRef} className={h.screen} data-mode="off">
            <WithdrawalReel />
            <VoiceCloud screenRef={screenRef} />
            <div className={h.screenGlass} />
          </div>
          <div ref={darkRef} className={h.dark} />
        </div>
        <div ref={scrimRef} className={h.scrim} />
        <div ref={endRef} className={h.endFade} />
      </div>

      <div ref={trackRef} className={h.track}>
        {/* data-chapter: the chapter menu entry each part of the night belongs to. */}
        <div ref={seg("intro")} className={h.segIntro} data-hour="20:00" data-tone="dark" data-chapter="top">
          {intro}
        </div>
        <div ref={seg("work")} id="work" className={h.segWork} data-hour="20:00" data-tone="dark" data-chapter="top">
          {workIntro}
        </div>
        {HOUSE_PROJECTS.slice(0, 2).map((p) => (
          <ProjectCard key={p.scene} {...p} t={t} segRef={seg(p.scene)} />
        ))}
        <div
          ref={seg("walk")}
          className={h.segWalk}
          data-scene="walk"
          data-hour="00:00"
          data-tone="dark"
          data-chapter="heladera"
        />
        {HOUSE_PROJECTS.slice(2).map((p) => (
          <ProjectCard key={p.scene} {...p} t={t} segRef={seg(p.scene)} />
        ))}
        <div
          ref={seg("dawn")}
          className={h.segDawn}
          data-scene="dawn"
          data-hour="06:00"
          data-tone="light"
          data-chapter="about"
        >
          {dawnIntro}
        </div>
      </div>
    </section>
  );
}

/**
 * Phones only: the plate's blurred continuation below the frame (built from the plate's bottom edge,
 * mirrored and blurred), so the picture runs on behind the parked card instead of ending in a line.
 */
function Ext({ plate }: { plate: string }) {
  return <div className={h.ext} style={{ backgroundImage: `url(/night/ext/${plate}.webp)` }} />;
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
      data-scene={scene}
      data-hour={hour}
      data-tone="dark"
      data-chapter={proj.id}
    >
      {/* Where a link to this chapter lands: the camera has arrived and the card is in view. */}
      <span id={proj.id} className={h.anchor} data-scene={scene} />
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

// Item boxes on the open-fridge plate (fractions of the image, measured on the fridge take's last
// frame), in the order of `strings.night.fridge.items`: milk, tomatoes, cheese, lettuce.
// `label`: where its name goes. Above, unless that covers another item (the cheese sits against the
// tomatoes, the lettuce right under them); "aboveDesktop" moves to the side on phones, where the
// milk's top is right under the nav.
const FRIDGE_ITEMS: { x: number; y: number; w: number; h: number; label: "above" | "right" | "aboveDesktop" }[] = [
  { x: 0.555, y: 0.572, w: 0.056, h: 0.201, label: "aboveDesktop" },
  { x: 0.59, y: 0.711, w: 0.065, h: 0.071, label: "above" },
  { x: 0.642, y: 0.75, w: 0.036, h: 0.046, label: "right" },
  { x: 0.591, y: 0.817, w: 0.086, h: 0.13, label: "right" },
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
            <div className={h.box} data-on={isSel} data-label={it.label} style={style}>
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
