import type { MetadataRoute } from "next";

// Written to out/sitemap.xml by the static export. The site is one page; the design and language
// switches are client-side views of it, not separate pages.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://portfolio-lucasfanelli.com/", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
