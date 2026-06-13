import { INSURA_AVATAR_SRC } from "@/lib/brand";
import { cn } from "@/lib/cn";
import Image from "next/image";

type ChatAgentAvatarProps = {
  size?: "sm" | "md";
  showStatus?: boolean;
  priority?: boolean;
};


const sizeClass = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
};

export function ChatAgentAvatar({
  size = "md",
  showStatus = true,
  priority = false,
}: ChatAgentAvatarProps) {
  return (
    <div className={cn("relative shrink-0", sizeClass[size])}>
      <div className="relative h-full w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-black/10">
        <Image
          src={INSURA_AVATAR_SRC}
          alt="Insura"
          fill
          priority={priority}
          className="object-cover object-[center_18%] scale-105"
          sizes={size === "sm" ? "36px" : "48px"}
        />
      </div>
      {showStatus && (
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
}
