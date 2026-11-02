import type { MetadataRoute } from "next";
import { PATHS, SITE } from "@/lib/seo";

// Written to out/sitemap.xml by the static export: one page per language, each pointing at the
// other. The design switch is a client-side view of the same page, not a page of its own.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: SITE + PATHS.en, es: SITE + PATHS.es };
  return (["en", "es"] as const).map((lang) => ({
    url: SITE + PATHS[lang],
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
