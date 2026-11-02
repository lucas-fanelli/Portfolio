"use client";

import React, { useCallback, useEffect, useState } from "react";
import DesignSwitcher from "./DesignSwitcher";
import PortfolioNavy from "./PortfolioNavy";
import PortfolioNight from "./PortfolioNight";
import PortfolioTerminal from "./PortfolioTerminal";
import TweaksPanel, { type Tweaks } from "./TweaksPanel";
import type { DesignId, Lang, Theme } from "@/lib/content";
import { backgroundFor } from "@/lib/designs";
import { PATHS } from "@/lib/seo";

// Only what the visitor picked is saved, so a default can still change for them later. The first
// version ("portfolio-tweaks") saved the defaults too, which would have pinned every past visitor to
// the old default design; it's dropped on the next visit.
const STORAGE_KEY = "portfolio-prefs";
const LEGACY_KEY = "portfolio-tweaks";

const DEFAULTS: Omit<Tweaks, "lang"> = {
  design: "night",
  theme: "dark",
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

function readStored(): Partial<Tweaks> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : {};
  } catch {
    // localStorage unavailable or JSON malformed — fall back to defaults.
    return {};
  }
}

type Props = {
  /** The language this page is prerendered in ("/" is English, "/es/" Spanish). */
  lang: Lang;
};

export default function PortfolioApp({ lang: pageLang }: Props) {
  const [tweaks, setTweaks] = useState<Tweaks>({ ...DEFAULTS, lang: pageLang });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Same order as the boot script in app/shell.tsx: query params win over stored prefs (so a link
  // like /?design=terminal opens that view), and the page's language over a stored one, except on
  // the English root, where a visitor who picked Spanish gets it back.
  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_KEY);
    } catch {
      // Storage blocked: nothing to clean up.
    }
    const stored = readStored();
    const params = new URLSearchParams(window.location.search);
    const fromUrl = sanitize({
      design: params.get("design") ?? undefined,
      theme: params.get("theme") ?? undefined,
      lang: params.get("lang") ?? undefined,
    });
    const lang = fromUrl.lang ?? (pageLang === "en" ? stored.lang : undefined) ?? pageLang;
    setTweaks((prev) => ({ ...prev, ...stored, ...fromUrl, lang }));
    setHydrated(true);
  }, [pageLang]);

  // The visitor's own design is on screen now, so the boot script's cover (layout.tsx) can go.
  useEffect(() => {
    if (hydrated) delete document.documentElement.dataset.boot;
  }, [hydrated]);

  // Screen readers pick their pronunciation (and search engines the language) from <html lang>.
  // (Before hydration the boot script has already set it from the same sources.)
  useEffect(() => {
    if (hydrated) document.documentElement.lang = tweaks.lang;
  }, [tweaks.lang, hydrated]);

  // The address follows the language ("/" or "/es/", both prerendered), so a reload or a shared
  // link opens the page in the language on screen. A ?lang= that brought the visitor here has done
  // its job and goes.
  useEffect(() => {
    if (!hydrated) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    url.pathname = PATHS[tweaks.lang];
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [tweaks.lang, hydrated]);

  // The browser bar takes the design's background. One Night sets its own, scene by scene.
  useEffect(() => {
    if (!hydrated || tweaks.design === "night") return;
    const color = backgroundFor(tweaks.design, tweaks.theme);
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => (m.content = color));
  }, [tweaks.design, tweaks.theme, hydrated]);

  const setTweak = useCallback(
    <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
      setTweaks((prev) => ({ ...prev, [key]: value }));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), [key]: value }));
      } catch {
        // Quota or privacy mode — state still works for this session.
      }
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
