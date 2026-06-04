import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { identity, strings } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "700"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} · Portfolio`,
    description,
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
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
