import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import localFont from "next/font/local";
import { identity, strings } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Self-hosted JetBrains Mono (official v2.304, OFL — see app/fonts/OFL-JetBrainsMono.txt), subset to
// Latin + punctuation + arrows + box drawing + geometric shapes. Google's "latin" subset lacks the
// box-drawing glyphs, so the ASCII diagrams fell back to a proportional font and lost alignment.
const jetbrains = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});

// Display serif for the "One Night" design.
const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
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
