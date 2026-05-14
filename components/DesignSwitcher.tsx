"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
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
];

export default function DesignSwitcher({ value, onChange, onOpenTweaks }: Props) {
  const { isMobile, width } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<DesignId, HTMLButtonElement | null>>({
    navy: null,
    terminal: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [measured, setMeasured] = useState(false);

  // Position the dark "active" pill behind the selected option. Re-measure when
  // value changes (animates), when the viewport resizes (labels may rewrap), or
  // on first mount (initial placement).
  useLayoutEffect(() => {
    const btn = btnRefs.current[value];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
    setMeasured(true);
  }, [value, width]);

  return (
    <div
      ref={containerRef}
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
        transition: "bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
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
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
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
          width: 30,
          height: 30,
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
