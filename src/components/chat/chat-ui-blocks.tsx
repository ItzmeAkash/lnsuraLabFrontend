"use client";

import { ChatLinkCard } from "@/components/chat/chat-link-card";
import { cn } from "@/lib/cn";
import type { ChatUiBlock } from "@/lib/chat-types";

type ChatUiBlocksProps = {
  blocks: ChatUiBlock[];
  className?: string;
};

export function ChatUiBlocks({ blocks, className }: ChatUiBlocksProps) {
  if (blocks.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {blocks.map((block, index) => (
        <ChatLinkCard
          key={`${block.block_type}-${block.url}-${index}`}
          url={block.url}
          title={block.title}
          description={block.message}
          buttonLabel={block.button_label}
        />
      ))}
    </div>
  );
}
