import { ChevronIcon } from "@/components/chat/options/chevron-icon";
import { OptionRowShell } from "@/components/chat/options/option-row-shell";
import type { OptionRowProps } from "@/lib/chat-options/types";
import { cn } from "@/lib/cn";

const OPTION_ROW_CLASS =
  "flex items-stretch overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-sm";
const OPTION_ROW_HOVER =
  "hover:border-[#1d70f1]/20 hover:shadow-[0_2px_10px_rgba(29,112,241,0.07)]";

export function StandardListRow({
  option,
  disabled,
  onSelect,
}: OptionRowProps) {
  return (
    <OptionRowShell
      disabled={disabled}
      onSelect={() => onSelect(option)}
      className={cn(OPTION_ROW_CLASS, !disabled && OPTION_ROW_HOVER)}
    >
      <div className="w-1 shrink-0 bg-[#1d70f1]" aria-hidden />
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-neutral-800">
          {option.label}
        </span>
      </div>
      <div className="flex shrink-0 items-center pr-3">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-150",
            !disabled &&
              "group-hover:bg-[#1d70f1]/10 group-hover:text-[#1d70f1]",
          )}
        >
          <ChevronIcon />
        </span>
      </div>
    </OptionRowShell>
  );
}
