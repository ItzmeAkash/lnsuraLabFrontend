import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/ui/section-label";

export function IntroHero() {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-background pt-28 pb-20 sm:pt-32 lg:pt-36"
    >
      <Container className="relative">
        <aside className="absolute top-8 left-4 hidden lg:block">
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-fade uppercase [writing-mode:vertical-rl] rotate-180">
            INTELLIGENCE — REDEFINING BROKERAGE
          </p>
        </aside>

        <div className="ml-auto max-w-4xl lg:pr-4 lg:pl-24">
          <SectionLabel className="mb-8 lg:hidden">
            BROKER INTELLIGENCE —
          </SectionLabel>

          <h1 className="text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight uppercase">
            <span className="block text-foreground">
              WE DESIGN DIGITAL EXPERIENCES THAT EMPOWER
            </span>
            <span className="mt-2 block text-muted">
              INSURANCE BROKERS TO STAND OUT AND ENGAGE YOUR CLIENTS.
            </span>
          </h1>

          <p className="mt-10 max-w-xl text-sm leading-relaxed text-foreground sm:text-base">
            By combining strategy, design, and technology, we transform ideas
            into meaningful digital experiences. Our work blends imagination
            with precision to create bold outcomes that drive growth.
          </p>
        </div>
      </Container>
    </section>
  );
}
