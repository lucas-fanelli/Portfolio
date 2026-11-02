import PortfolioApp from "@/components/PortfolioApp";
import { pageMetadata, profileJsonLd } from "@/lib/seo";

export const metadata = pageMetadata("en");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd("en")) }} />
      <PortfolioApp lang="en" />
    </>
  );
}
