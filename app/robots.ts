import type { MetadataRoute } from "next";

// Written to out/robots.txt by the static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://portfolio-lucasfanelli.com/sitemap.xml",
  };
}
