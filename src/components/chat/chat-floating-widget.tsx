"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatToggleButton } from "@/components/chat/chat-toggle-button";
import { useEmbedConfig } from "@/components/embed/embed-config-provider";
import { cn } from "@/lib/cn";
import {
  getEmbedIframeSize,
  postEmbedResizeToParent,
} from "@/lib/embed/parent-resize";
import { useEffect, useState } from "react";

export function ChatFloatingWidget() {
  const { mode } = useEmbedConfig();
  const isEmbed = mode === "embed";
  const [open, setOpen] = useState(false);

  const positionClass = isEmbed
    ? "right-4 bottom-4"
    : "right-5 bottom-24 sm:right-8 sm:bottom-28";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!isEmbed) return;

    const syncIframeSize = () => {
      const { width, height } = getEmbedIframeSize(open);
      postEmbedResizeToParent(width, height);
    };

    syncIframeSize();

    if (!open) return;

    window.addEventListener("resize", syncIframeSize);
    return () => window.removeEventListener("resize", syncIframeSize);
  }, [isEmbed, open]);

  return (
    <>
      {open && (
        <ChatPanel open={open} onClose={() => setOpen(false)} />
      )}

      <div
        className={cn(
          "fixed z-[100]",
          positionClass,
          open && "pointer-events-none opacity-0 scale-90",
          "transition-all duration-300",
        )}
        aria-hidden={open}
      >
        <ChatToggleButton onClick={() => setOpen(true)} />
      </div>
    </>
  );
}
