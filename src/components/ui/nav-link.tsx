import { cn } from "@/lib/cn";
import Link from "next/link";
import type { NavLinkItem } from "@/lib/navigation";

type NavLinkProps = NavLinkItem;

export function NavLink({ label, href, accent }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full bg-nav-pill px-4 py-2 text-[11px] font-semibold tracking-wide transition-colors hover:bg-neutral-700",
        accent ? "text-brand" : "text-white",
      )}
    >
      {label}
    </Link>
  );
}
