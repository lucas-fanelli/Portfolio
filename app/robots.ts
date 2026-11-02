import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Written to out/robots.txt by the static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
