import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type ChatToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function ChatToolbarButton({
  label,
  className,
  children,
  ...props
}: ChatToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
