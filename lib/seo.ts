import type { Metadata } from "next";
import { identity, skills, strings, type Lang } from "./content";

export const SITE = "https://portfolio-lucasfanelli.com";

/** Each language has its own prerendered page; the language switch moves between them. */
export const PATHS: Record<Lang, string> = { en: "/", es: "/es/" };

const LOCALES: Record<Lang, string> = { en: "en_US", es: "es_ES" };

const KEYWORDS: Record<Lang, string[]> = {
  en: ["Lucas Fanelli", "portfolio", "software developer", "Computer Science", "Mathematics", "Unity", "Next.js", "Kotlin", "University of Málaga"],
  es: ["Lucas Fanelli", "portfolio", "desarrollador de software", "Ingeniería Informática", "Matemáticas", "Unity", "Next.js", "Kotlin", "Universidad de Málaga"],
};

export function pageMetadata(lang: Lang): Metadata {
  const title = `${identity.name} · Portfolio`;
  const description = strings.hero.intro[lang];
  const other: Lang = lang === "es" ? "en" : "es";
  // Share cards: the opening shot of One Night, one per language (source: scripts/og.mjs).
  const image = { url: lang === "es" ? "/og-es.jpg" : "/og.jpg", width: 1200, height: 630, alt: title, type: "image/jpeg" };
  // Two given names, two surnames, split as in the One Night hero.
  const words = identity.name.split(" ");
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    authors: [{ name: identity.name }],
    keywords: KEYWORDS[lang],
    alternates: {
      canonical: PATHS[lang],
      languages: { en: PATHS.en, es: PATHS.es, "x-default": PATHS.en },
    },
    openGraph: {
      type: "profile",
      firstName: words.slice(0, 2).join(" "),
      lastName: words.slice(2).join(" "),
      title,
      description,
      url: PATHS[lang],
      locale: LOCALES[lang],
      alternateLocale: LOCALES[other],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

/** schema.org ProfilePage about Lucas, for search engines. Every value comes from lib/content. */
export function profileJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE + PATHS[lang],
    inLanguage: lang,
    name: `${identity.name} · Portfolio`,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: identity.name,
      alternateName: "Lucas Fanelli",
      url: SITE + PATHS[lang],
      image: `${SITE}/night/lucas.webp`,
      email: `mailto:${identity.email}`,
      jobTitle: strings.hero.role[lang],
      description: strings.hero.intro[lang],
      address: { "@type": "PostalAddress", addressLocality: "Vélez-Málaga", addressCountry: "ES" },
      affiliation: { "@type": "CollegeOrUniversity", name: strings.education.degreeInst[lang] },
      knowsLanguage: ["es", "en"],
      knowsAbout: [...skills.map((s) => s.lang), ...strings.methodology[lang]],
      sameAs: [identity.linkedinUrl, identity.githubUrl],
    },
  };
}
