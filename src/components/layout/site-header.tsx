import { IconButton } from "@/components/ui/icon-button";
import { NavLink } from "@/components/ui/nav-link";
import { Container } from "@/components/layout/container";
import { NAV_LINKS } from "@/lib/navigation";
import Image from "next/image";
import Link from "next/link";

function MenuIcon() {
  return (
    <span className="flex flex-col gap-1.5" aria-hidden>
      <span className="h-0.5 w-5 bg-white" />
      <span className="h-0.5 w-5 bg-white" />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <Container>
        <div className="flex items-center justify-between gap-4 rounded-full bg-header px-4 py-2.5 sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="#home" className="shrink-0">
              <Image
                src="/logo.png"
                alt="InsuranceLab"
                width={180}
                height={36}
                className="h-7 w-auto sm:h-8"
                priority
              />
            </Link>
            <span className="hidden border-l border-neutral-700 pl-4 text-[10px] font-medium tracking-[0.2em] text-neutral-500 sm:inline">
              BROKER INTELLIGENCE
            </span>
          </div>

          <nav className="hidden items-center gap-1.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>

          <IconButton aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        </div>
      </Container>
    </header>
  );
}
