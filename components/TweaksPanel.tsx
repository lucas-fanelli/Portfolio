"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DesignId, Lang, Theme } from "@/lib/content";
import { useViewport } from "@/lib/useViewport";

export type Tweaks = {
  design: DesignId;
  theme: Theme;
  lang: Lang;
};

type Props = {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  onClose: () => void;
};

function TweakLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#6a7385",
        fontWeight: 600,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function NavyPreview() {
  return (
    <svg viewBox="0 0 56 40" width="56" height="40">
      <rect width="56" height="40" fill="#f7f6f3" />
      <rect x="0" y="0" width="56" height="7" fill="#fff" />
      <rect x="3" y="2.5" width="6" height="2" rx="1" fill="#2B4C7E" />
      <rect x="44" y="2.5" width="9" height="2" rx="1" fill="#e0e2e8" />
      <rect x="4" y="11" width="22" height="3" rx="0.5" fill="#1a1f2c" />
      <rect x="4" y="15.5" width="14" height="1.6" rx="0.5" fill="#9aa1b3" />
      <rect x="4" y="22" width="48" height="14" rx="2" fill="#fff" stroke="#dde0e6" />
      <rect x="7" y="25" width="11" height="2" rx="0.5" fill="#2B4C7E" />
      <rect x="7" y="28.5" width="14" height="1.4" rx="0.4" fill="#9aa1b3" />
      <rect x="32" y="25" width="17" height="8" rx="1" fill="#0f1422" />
    </svg>
  );
}

function TerminalPreview() {
  return (
    <svg viewBox="0 0 56 40" width="56" height="40">
      <rect width="56" height="40" fill="#0b0e0a" />
      <rect width="56" height="6" fill="#0f1410" />
      <circle cx="4" cy="3" r="1" fill="#ff5f57" />
      <circle cx="8" cy="3" r="1" fill="#febc2e" />
      <circle cx="12" cy="3" r="1" fill="#28c840" />
      <text x="3" y="14" fill="#7cf28a" fontFamily="monospace" fontSize="3.6" fontWeight="700">
        $
      </text>
      <rect x="7" y="11" width="22" height="2" fill="#cfe9c4" />
      <rect x="3" y="17" width="40" height="1.4" fill="#5d7c54" />
      <rect x="3" y="20.5" width="32" height="1.4" fill="#5d7c54" />
      <rect x="3" y="25" width="50" height="12" fill="#0f1410" stroke="#1d3320" />
      <rect x="5" y="27.5" width="6" height="1.6" fill="#f0c14b" />
      <rect x="5" y="31" width="20" height="1.4" fill="#cfe9c4" />
      <rect x="5" y="33.6" width="14" height="1.4" fill="#cfe9c4" />
    </svg>
  );
}

const DESIGN_SWATCHES: {
  id: DesignId;
  title: string;
  desc: string;
  preview: React.ReactNode;
}[] = [
  { id: "navy", title: "Navy Minimal", desc: "Clean sans · navy accent · code snippets", preview: <NavyPreview /> },
  { id: "terminal", title: "Terminal Dev", desc: "Monospace shell · ASCII · ANSI palette", preview: <TerminalPreview /> },
];

const THEMES: { id: Theme; bg: string; ink: string }[] = [
  { id: "light", bg: "#f7f6f3", ink: "#1a1f2c" },
  { id: "dark", bg: "#0d1117", ink: "#e6edf3" },
  { id: "navy", bg: "#1a2c4a", ink: "#f3ecd9" },
];

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];

const ACTIVE_BORDER = "#1a1f2c";
const INACTIVE_BORDER = "rgba(0,0,0,0.1)";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export default function TweaksPanel({ tweaks, setTweak, onClose }: Props) {
  const { isMobile, width } = useViewport();
  const [show, setShow] = useState(false);

  // Sliding indicator behind the active language button (mirrors DesignSwitcher pill)
  const langRow = useRef<HTMLDivElement>(null);
  const langBtns = useRef<Record<Lang, HTMLButtonElement | null>>({ en: null, es: null });
  const [langInd, setLangInd] = useState({ left: 0, width: 0, ready: false });

  useEffect(() => {
    // Fade/slide in on mount.
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    const btn = langBtns.current[tweaks.lang];
    const row = langRow.current;
    if (!btn || !row) return;
    const rRect = row.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setLangInd({ left: bRect.left - rRect.left, width: bRect.width, ready: true });
  }, [tweaks.lang, width, show]);

  // Position: desktop → bottom-right; mobile → bottom-centre. Animated between.
  // Both states use `left: 50%` so we only animate the `transform` value.
  const restingTransform = isMobile
    ? "translate3d(-50%, 0, 0)"
    : "translate3d(calc(50vw - 100% - 16px), 0, 0)";
  const enterTransform = isMobile
    ? "translate3d(-50%, 24px, 0)"
    : "translate3d(calc(50vw - 100% - 16px), 24px, 0)";

  return (
    <div
      role="dialog"
      aria-label="Tweaks"
      style={{
        position: "fixed",
        bottom: isMobile ? 24 : 16,
        left: "50%",
        zIndex: 9999,
        width: "min(320px, calc(100vw - 32px))",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily: 'var(--font-inter), "Inter", system-ui, sans-serif',
        color: "#1a1f2c",
        overflow: "hidden",
        transform: show ? restingTransform : enterTransform,
        opacity: show ? 1 : 0,
        transition: `transform 0.4s ${EASE}, opacity 0.3s ease, bottom 0.3s ease, width 0.4s ${EASE}`,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600 }}>Tweaks</div>
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          aria-label="Close tweaks"
          style={{
            width: 24,
            height: 24,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            color: "#6a7385",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1a1f2c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6a7385";
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: 16 }}>
        <TweakLabel>Design</TweakLabel>
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {DESIGN_SWATCHES.map((d) => {
            const active = tweaks.design === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setTweak("design", d.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 12,
                  alignItems: "center",
                  textAlign: "left",
                  padding: 10,
                  borderRadius: 10,
                  border: "2px solid",
                  borderColor: active ? ACTIVE_BORDER : INACTIVE_BORDER,
                  background: active ? "rgba(26,31,44,0.04)" : "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: `border-color 0.25s ease, background 0.25s ease`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 40,
                    borderRadius: 5,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {d.preview}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: 11, color: "#6a7385", marginTop: 2, lineHeight: 1.4 }}>
                    {d.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <TweakLabel>Color theme</TweakLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
            marginBottom: 18,
          }}
        >
          {THEMES.map((th) => {
            const active = tweaks.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setTweak("theme", th.id)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: "2px solid",
                  borderColor: active ? ACTIVE_BORDER : INACTIVE_BORDER,
                  background: th.bg,
                  color: th.ink,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  transform: active ? "scale(1.02)" : "scale(1)",
                  transition: `border-color 0.25s ease, transform 0.25s ${EASE}`,
                }}
              >
                {th.id}
              </button>
            );
          })}
        </div>

        <TweakLabel>Language</TweakLabel>
        <div
          ref={langRow}
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: langInd.left,
              width: langInd.width,
              background: "#1a1f2c",
              borderRadius: 8,
              opacity: langInd.ready ? 1 : 0,
              transition: `left 0.4s ${EASE}, width 0.4s ${EASE}, opacity 0.2s ease`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {LANGS.map((l) => {
            const active = tweaks.lang === l.id;
            return (
              <button
                key={l.id}
                ref={(el) => {
                  langBtns.current[l.id] = el;
                }}
                onClick={() => setTweak("lang", l.id)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "2px solid transparent",
                  background: "transparent",
                  color: active ? "#fff" : "#1a1f2c",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            fontSize: 11,
            color: "#6a7385",
            lineHeight: 1.5,
          }}
        >
          All settings persist on reload.
        </div>
      </div>
    </div>
  );
}
