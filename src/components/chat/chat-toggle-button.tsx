import { useEmbedConfig } from "@/components/embed/embed-config-provider";
import { INSURA_AVATAR_SRC } from "@/lib/brand";
import { cn } from "@/lib/cn";
import Image from "next/image";

type ChatToggleButtonProps = {
  onClick: () => void;
};

export function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  const { mode } = useEmbedConfig();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Chat with Insura"
      className={cn(
        "relative h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-neutral-900 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        mode === "embed"
          ? "shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          : "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
      )}
    >
      <Image
        src={INSURA_AVATAR_SRC}
        alt="Insura"
        fill
        priority
        quality={90}
        className="object-cover object-[center_15%] scale-110"
        sizes="56px"
      />
      <span
        className="absolute right-0.5 bottom-0.5 z-10 h-3 w-3 rounded-full border-2 border-white bg-green-500"
        aria-hidden
      />
    </button>
  );
}
