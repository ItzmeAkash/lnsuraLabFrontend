import { ParticleNetworkBackground } from "@/components/home/particle-network-background";
import { SocialBar } from "@/components/home/social-bar";
import { BrandMark } from "@/components/icons/brand-mark";
import { Container } from "@/components/layout/container";

export function BrandHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white"
    >
      <ParticleNetworkBackground />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <BrandMark className="mb-6" />

        <h2 className="text-[clamp(3.5rem,14vw,11rem)] leading-[0.85] font-black tracking-tighter uppercase">
          <span className="text-white">INSURANCE</span>
          <span className="text-brand">LAB</span>
        </h2>

        <p className="mt-6 text-sm tracking-wide text-neutral-300 sm:text-base">
          Digitalizing your insurance world
        </p>
      </Container>

      <SocialBar />
    </section>
  );
}
