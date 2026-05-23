import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

export function IconButton({
  className,
  size = "md",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-nav-pill text-white transition-colors hover:bg-neutral-700",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
