import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { identity, strings } from "@/lib/content";
import "./globals.css";

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

const description = strings.hero.intro.en;

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-lucasfanelli.com"),
  title: `${identity.name} · Portfolio`,
  description,
  authors: [{ name: identity.name }],
  keywords: [
    "Lucas Fanelli",
    "portfolio",
    "Computer Science",
    "Mathematics",
    "Unity",
    "Next.js",
    "Kotlin",
    "Universidad de Málaga",
  ],
  openGraph: {
    title: `${identity.name} · Portfolio`,
    description,
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    // Static card at /public/og.png (served as image/png via its extension).
    // Design source + regen recipe: scripts/og-image.tsx.
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: `${identity.name} · Portfolio` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} · Portfolio`,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
