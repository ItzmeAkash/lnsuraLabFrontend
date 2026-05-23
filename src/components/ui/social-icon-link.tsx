import { SocialIcon } from "@/components/icons/social-icons";
import { cn } from "@/lib/cn";
import type { SocialLinkItem } from "@/lib/navigation";
import Link from "next/link";

type SocialIconLinkProps = Pick<SocialLinkItem, "href" | "label" | "icon"> & {
  className?: string;
};

export function SocialIconLink({
  href,
  label,
  icon,
  className,
}: SocialIconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20",
        className,
      )}
    >
      <SocialIcon icon={icon} className="h-4 w-4" />
    </Link>
  );
}
