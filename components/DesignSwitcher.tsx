"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DesignId } from "@/lib/content";
import { useViewport } from "@/lib/useViewport";

type Props = {
  value: DesignId;
  onChange: (id: DesignId) => void;
  onOpenTweaks: () => void;
};

const OPTIONS: { id: DesignId; label: string; icon: string }[] = [
  { id: "navy", label: "Minimal", icon: "▦" },
  { id: "terminal", label: "Terminal", icon: "$_" },
  { id: "night", label: "Night", icon: "☾" },
];

export default function DesignSwitcher({ value, onChange, onOpenTweaks }: Props) {
  const { isMobile, width } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<DesignId, HTMLButtonElement | null>>({
    navy: null,
    terminal: null,
    night: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [measured, setMeasured] = useState(false);
  // Stay hidden until the web fonts have loaded: the pill is centred, so a font swap changes its
  // width and position — Lighthouse counted that as layout shift. Hidden elements don't shift.
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) setFontsReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // A design can mark text the pill must not sit on (data-switcher-avoid, e.g. the One Night hero on
  // a phone or a short laptop screen): the pill fades out while it overlaps that text and comes back
  // once the visitor scrolls past it. It never hides while it holds keyboard focus.
  const [covering, setCovering] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const box = containerRef.current;
      if (!box) return;
      if (box.contains(document.activeElement)) {
        setCovering(false);
        return;
      }
      const b = box.getBoundingClientRect();
      const hit = Array.from(document.querySelectorAll("[data-switcher-avoid]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > b.top && r.top < b.bottom && r.right > b.left && r.left < b.right;
      });
      setCovering(hit);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [value, fontsReady]);
  const shown = fontsReady && !covering;

  // Position the dark "active" pill behind the selected option. Re-measure when
  // value changes (animates), when the viewport resizes (labels may rewrap), on
  // first mount (initial placement), and once the real fonts set the label widths.
  useLayoutEffect(() => {
    const btn = btnRefs.current[value];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
    setMeasured(true);
  }, [value, width, fontsReady]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Design"
      style={{
        position: "fixed",
        bottom: isMobile ? 24 : 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        maxWidth: "calc(100vw - 32px)",
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily: 'var(--font-inter), "Inter", system-ui, sans-serif',
        // visibility flips after the fade-out (and before the fade-in), so a hidden pill can't be
        // clicked or tabbed into.
        visibility: shown ? "visible" : "hidden",
        opacity: shown ? 1 : 0,
        transition: "bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, visibility 0.4s",
      }}
    >
      {/* Sliding dark indicator */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: indicator.left,
          width: indicator.width,
          background: "#1a1f2c",
          borderRadius: 999,
          opacity: measured ? 1 : 0,
          transition:
            "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              btnRefs.current[opt.id] = el;
            }}
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              // Finger-sized on phones (44px, Apple's minimum); the mouse-sized pill stays on desktop.
              minHeight: isMobile ? 44 : undefined,
              borderRadius: 999,
              border: 0,
              background: "transparent",
              color: active ? "#fff" : "#1a1f2c",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.01em",
              transition: "color 0.3s ease",
            }}
          >
            <span
              style={{
                // Fixed box so the pill's width (and centred position) doesn't change when the
                // web fonts swap in — that swap was a measurable layout shift.
                display: "inline-block",
                width: 16,
                textAlign: "center",
                fontFamily:
                  opt.id === "terminal"
                    ? 'var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace'
                    : "inherit",
                fontSize: opt.id === "terminal" ? 11 : 12,
                opacity: active ? 1 : 0.6,
                transition: "opacity 0.3s ease",
              }}
            >
              {opt.icon}
            </span>
            {opt.label}
          </button>
        );
      })}
      <span
        aria-hidden="true"
        style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)", margin: "0 2px", zIndex: 1 }}
      />
      <button
        onClick={onOpenTweaks}
        title="Open tweaks"
        aria-label="Open tweaks"
        style={{
          position: "relative",
          zIndex: 1,
          width: isMobile ? 44 : 30,
          height: isMobile ? 44 : 30,
          borderRadius: "50%",
          border: 0,
          background: "transparent",
          color: "#1a1f2c",
          cursor: "pointer",
          fontSize: 14,
          fontFamily: "inherit",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        ⚙
      </button>
    </div>
  );
}
