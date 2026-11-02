import type { Viewport } from "next";
import localFont from "next/font/local";
import type { Lang } from "@/lib/content";
import { BACKGROUNDS } from "@/lib/designs";
import "./globals.css";

// The <html> both root layouts share: (en)/layout.tsx serves "/" and (es)/layout.tsx serves "/es/",
// so each page is prerendered with its own lang attribute.

// All fonts are self-hosted from their official OFL releases (licences in app/fonts/), subset with
// subset-font. Nothing is fetched from Google at build time: next/font/google intermittently failed
// the build ("Cannot read properties of null (reading '1')" while parsing Google's font CSS).

// Inter v4.1 (rsms/inter), variable; optical size pinned, weight 400–700.
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

// JetBrains Mono v2.304, subset to Latin + punctuation + arrows + box drawing + geometric shapes.
// Google's "latin" subset lacked the box-drawing glyphs, so the ASCII diagrams fell back to a
// proportional font and lost alignment.
const jetbrains = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  // Mono is only small labels above the fold (diagrams live further down), so its three files
  // (~124 KB) shouldn't compete with the hero image for bandwidth on a slow connection.
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});

// Instrument Serif (google/fonts, ofl/instrumentserif): display serif for the "One Night" design.
const instrument = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // One Night's, the prerendered design; the other designs set their own once they load.
  themeColor: BACKGROUNDS.night,
};

// The static HTML is One Night in the page's language. A visitor who picked another design or
// language (saved in localStorage, or linked with ?design=…&lang=…) would see that page flash
// before React swaps theirs in. This runs before the first paint: it sets the page language and
// hides the page on the chosen design's background until PortfolioApp clears `data-boot` (or after
// 4 s, if the scripts never load, so the static page still shows). The page's own language wins
// over a saved one, except on the English root, where a visitor who picked Spanish gets it back.
// Keep the keys, values and order in sync with PortfolioApp.
const BOOT = `(function (BG) {
  var h = document.documentElement;
  var page = h.lang;
  var stored = {};
  try {
    stored = JSON.parse(localStorage.getItem("portfolio-prefs") || "{}") || {};
  } catch (e) {
    /* storage blocked or malformed: the URL and the defaults decide, as in PortfolioApp */
  }
  var q = new URLSearchParams(location.search);
  function valid(v, list) {
    return list.indexOf(v) >= 0 ? v : null;
  }
  var D = ["night", "navy", "terminal"], T = ["light", "dark", "navy"], L = ["en", "es"];
  var design = valid(q.get("design"), D) || valid(stored.design, D) || "night";
  var theme = valid(q.get("theme"), T) || valid(stored.theme, T) || "dark";
  var lang = valid(q.get("lang"), L) || (page === "en" && valid(stored.lang, L)) || page;
  h.lang = lang;
  if (design === "night" && lang === page) return;
  h.dataset.boot = "";
  h.style.setProperty("--boot-bg", design === "night" ? BG.night : BG[design][theme]);
  setTimeout(function () { delete h.dataset.boot; }, 4000);
})(${JSON.stringify(BACKGROUNDS)});`;

export const fontVariables = `${inter.variable} ${jetbrains.variable} ${instrument.variable}`;

export default function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    // The boot script changes lang, data-boot and --boot-bg before hydration.
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
