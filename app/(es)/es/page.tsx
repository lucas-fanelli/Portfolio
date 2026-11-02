import PortfolioApp from "@/components/PortfolioApp";
import { pageMetadata, profileJsonLd } from "@/lib/seo";

export const metadata = pageMetadata("es");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd("es")) }} />
      <PortfolioApp lang="es" />
    </>
  );
}
