import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type SectionLabelProps = HTMLAttributes<HTMLParagraphElement> & {
  icon?: string;
};

export function SectionLabel({
  className,
  icon = "✳",
  children,
  ...props
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[11px] font-medium tracking-[0.25em] text-muted-light uppercase",
        className,
      )}
      {...props}
    >
      <span className="text-base leading-none text-foreground">{icon}</span>
      {children}
    </p>
  );
}
