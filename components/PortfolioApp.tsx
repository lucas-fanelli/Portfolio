"use client";

import React, { useCallback, useEffect, useState } from "react";
import DesignSwitcher from "./DesignSwitcher";
import PortfolioNavy from "./PortfolioNavy";
import PortfolioTerminal from "./PortfolioTerminal";
import TweaksPanel, { type Tweaks } from "./TweaksPanel";
import type { DesignId, Lang, Theme } from "@/lib/content";

const STORAGE_KEY = "portfolio-tweaks";

const DEFAULT_TWEAKS: Tweaks = {
  design: "navy",
  theme: "dark",
  lang: "en",
};

const VALID_DESIGN: ReadonlySet<DesignId> = new Set<DesignId>(["navy", "terminal"]);
const VALID_THEME: ReadonlySet<Theme> = new Set<Theme>(["light", "dark", "navy"]);
const VALID_LANG: ReadonlySet<Lang> = new Set<Lang>(["en", "es"]);

function sanitize(input: unknown): Partial<Tweaks> {
  if (!input || typeof input !== "object") return {};
  const obj = input as Record<string, unknown>;
  const out: Partial<Tweaks> = {};
  if (typeof obj.design === "string" && VALID_DESIGN.has(obj.design as DesignId)) {
    out.design = obj.design as DesignId;
  }
  if (typeof obj.theme === "string" && VALID_THEME.has(obj.theme as Theme)) {
    out.theme = obj.theme as Theme;
  }
  if (typeof obj.lang === "string" && VALID_LANG.has(obj.lang as Lang)) {
    out.lang = obj.lang as Lang;
  }
  return out;
}

export default function PortfolioApp() {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = sanitize(JSON.parse(raw));
        if (Object.keys(stored).length > 0) {
          setTweaks((prev) => ({ ...prev, ...stored }));
        }
      }
    } catch {
      // localStorage unavailable or JSON malformed — fall back to defaults.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch {
      // Quota or privacy mode — state still works for this session.
    }
  }, [tweaks, hydrated]);

  const setTweak = useCallback(
    <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
      setTweaks((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setTheme = useCallback((v: Theme) => setTweak("theme", v), [setTweak]);
  const setLang = useCallback((v: Lang) => setTweak("lang", v), [setTweak]);
  const setDesign = useCallback((v: DesignId) => setTweak("design", v), [setTweak]);

  const Design = tweaks.design === "terminal" ? PortfolioTerminal : PortfolioNavy;

  return (
    <>
      <Design
        theme={tweaks.theme}
        lang={tweaks.lang}
        setTheme={setTheme}
        setLang={setLang}
      />

      {!tweaksOpen && (
        <DesignSwitcher
          value={tweaks.design}
          onChange={setDesign}
          onOpenTweaks={() => setTweaksOpen(true)}
        />
      )}

      {tweaksOpen && (
        <TweaksPanel
          tweaks={tweaks}
          setTweak={setTweak}
          onClose={() => setTweaksOpen(false)}
        />
      )}
    </>
  );
}
