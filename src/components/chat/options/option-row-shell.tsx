import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type OptionRowShellProps = {
  disabled: boolean;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
};

export function OptionRowShell({
  disabled,
  onSelect,
  className,
  children,
}: OptionRowShellProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group w-full text-left transition-all duration-150",
        disabled ? "cursor-not-allowed opacity-55" : "active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
}
