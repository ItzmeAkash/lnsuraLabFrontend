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
    <div className="relative h-16 w-16">
      <span className="chat-launcher-pulse-ring" aria-hidden />
      <span
        className="chat-launcher-pulse-ring chat-launcher-pulse-ring--delay"
        aria-hidden
      />

      <button
        type="button"
        onClick={onClick}
        aria-label="Chat with Insura"
        className={cn(
          "relative h-full w-full overflow-hidden rounded-full border-2 border-[#1d70f1] bg-neutral-900 animate-chat-launcher-glow transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          mode === "embed"
            ? "shadow-[0_4px_20px_rgba(29,112,241,0.35)]"
            : "shadow-[0_8px_32px_rgba(29,112,241,0.4)]",
        )}
      >
        <Image
          src={INSURA_AVATAR_SRC}
          alt="Insura"
          fill
          priority
          quality={90}
          className="object-cover object-[center_15%] scale-110"
          sizes="64px"
        />
        <span
          className="absolute right-0.5 bottom-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-[#1d70f1] bg-green-500"
          aria-hidden
        />
      </button>
    </div>
  );
}
