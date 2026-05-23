import { BrandHero } from "@/components/home/brand-hero";
import { IntroHero } from "@/components/home/intro-hero";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero />
        <IntroHero />
      </main>
    </>
  );
}
