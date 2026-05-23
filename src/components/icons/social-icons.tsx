import type { SocialLinkItem } from "@/lib/navigation";

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.6 4.8 6.1V24h-4v-7.2c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V24h-4V8.5z" />
    </svg>
  );
}

export function BehanceIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 7h4.2c2 0 3.2 1 3.2 2.6 0 1.1-.6 2-1.6 2.4 1.3.4 2.2 1.5 2.2 3.1 0 2.2-1.7 3.4-4.4 3.4H2V7h4.5zm-.2 4.1h1.8c1.1 0 1.7-.5 1.7-1.3s-.6-1.2-1.7-1.2H6.3v2.5zm0 4.3h2c1.2 0 1.9-.5 1.9-1.4s-.7-1.5-2-1.5h-1.9v2.9zM15 7h6v2h-6V7zm.2 9.4c0-2.5 1.4-4.1 3.6-4.1 2.3 0 3.5 1.5 3.5 4.2v.5h-5.8c.2 1.2 1 1.9 2.2 1.9 1 0 1.7-.4 2-1.2h3.5c-.6 2.3-2.5 3.6-5.5 3.6-3.3 0-5.5-2-5.5-4.9zm3.4-2.5c-1.1 0-1.8.7-2 2h4c-.2-1.3-.9-2-2-2z" />
    </svg>
  );
}

export function DribbbleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 4.1a8.4 8.4 0 0 1 2.1 4.2c-2.4-.5-4.6-.3-6.7.5.7-1.7 1.4-3.2 2.1-4.4 1-.1 1.9-.2 2.5-.3zM12 4c1 0 2 .2 2.9.5-1 2-1.8 3.8-2.4 5.5-2.3-.7-4.3-.8-6.2-.4A8 8 0 0 1 12 4zm-4.8 2.5c2.1-.5 4.3-.3 6.6.6-.6 1.5-1.1 3.1-1.5 4.7-2.8.9-5.2 2.3-7.1 4.3A8 8 0 0 1 7.2 6.5zm-.5 11c.6-2 2.2-3.8 4.6-4.8.4 1.6 1 3.3 1.7 5-2 .6-3.7 1.5-5 2.9a8 8 0 0 1-1.3-3.1zm4.3 4.4c-.6-1.8-1.1-3.4-1.5-4.8 2.2-.7 4.4-.8 6.7 0-.8 2.2-1.8 3.9-2.8 5.1-1 .1-1.7.1-2.4-.3zm3.5-1.2c.7-1.2 1.4-2.7 2-4.5 2.2.6 4.2 1.6 5.8 3.1a8 8 0 0 1-7.8 1.4z" />
    </svg>
  );
}

const iconMap = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  behance: BehanceIcon,
  dribbble: DribbbleIcon,
} as const;

export function SocialIcon({
  icon,
  className,
}: {
  icon: SocialLinkItem["icon"];
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon className={className} />;
}
