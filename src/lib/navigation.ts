export type NavLinkItem = {
  label: string;
  href: string;
  accent?: boolean;
};

export const NAV_LINKS: NavLinkItem[] = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "LOGIN", href: "#login", accent: true },
  { label: "SIGNUP", href: "#signup" },
  { label: "CONTACT", href: "#contact" },
];

export type SocialLinkItem = {
  label: string;
  href: string;
  icon: "instagram" | "linkedin" | "behance" | "dribbble";
};

export const SOCIAL_LINKS: SocialLinkItem[] = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Behance", href: "#", icon: "behance" },
  { label: "Dribbble", href: "#", icon: "dribbble" },
];
