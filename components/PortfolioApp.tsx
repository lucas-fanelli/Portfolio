"use client";

import React, { useCallback, useEffect, useState } from "react";
import DesignSwitcher from "./DesignSwitcher";
import PortfolioNavy from "./PortfolioNavy";
import PortfolioNight from "./PortfolioNight";
import PortfolioTerminal from "./PortfolioTerminal";
import TweaksPanel, { type Tweaks } from "./TweaksPanel";
import type { DesignId, Lang, Theme } from "@/lib/content";

const STORAGE_KEY = "portfolio-tweaks";

const DEFAULT_TWEAKS: Tweaks = {
  design: "navy",
  theme: "dark",
  lang: "en",
};

const VALID_DESIGN: ReadonlySet<DesignId> = new Set<DesignId>(["navy", "terminal", "night"]);

const DESIGNS = {
  navy: PortfolioNavy,
  terminal: PortfolioTerminal,
  night: PortfolioNight,
} satisfies Record<DesignId, unknown>;
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
    let stored: Partial<Tweaks> = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = sanitize(JSON.parse(raw));
    } catch {
      // localStorage unavailable or JSON malformed — fall back to defaults.
    }
    // Query params win over stored prefs, so a link like /?design=night&lang=es opens that view.
    const params = new URLSearchParams(window.location.search);
    const fromUrl = sanitize({
      design: params.get("design") ?? undefined,
      theme: params.get("theme") ?? undefined,
      lang: params.get("lang") ?? undefined,
    });
    if (Object.keys(stored).length > 0 || Object.keys(fromUrl).length > 0) {
      setTweaks((prev) => ({ ...prev, ...stored, ...fromUrl }));
    }
    setHydrated(true);
  }, []);

  // The visitor's own design is on screen now, so the boot script's cover (layout.tsx) can go.
  useEffect(() => {
    if (hydrated) delete document.documentElement.dataset.boot;
  }, [hydrated]);

  // Screen readers pick their pronunciation (and search engines the language) from <html lang>.
  // (Before hydration the boot script has already set it from the same sources.)
  useEffect(() => {
    if (hydrated) document.documentElement.lang = tweaks.lang;
  }, [tweaks.lang, hydrated]);

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

  const Design = DESIGNS[tweaks.design];

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
