import { SocialIconLink } from "@/components/ui/social-icon-link";
import { SOCIAL_LINKS } from "@/lib/navigation";

export function SocialBar() {
  const leftLinks = SOCIAL_LINKS.slice(0, 2);
  const rightLinks = SOCIAL_LINKS.slice(2);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex items-end justify-between px-6 sm:px-10 lg:px-16">
      <div className="pointer-events-auto flex gap-3">
        {leftLinks.map((item) => (
          <SocialIconLink key={item.label} {...item} />
        ))}
      </div>

      <div className="pointer-events-auto flex gap-3">
        {rightLinks.map((item) => (
          <SocialIconLink key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
