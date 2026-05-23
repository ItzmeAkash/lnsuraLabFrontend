"use client";

import { ChatWidgetProvider } from "@/components/chat/chat-widget-provider";
import { EmbedConfigProvider } from "@/components/embed/embed-config-provider";
import { usePathname } from "next/navigation";

export function ChatWidgetGate() {
  const pathname = usePathname();

  if (pathname?.startsWith("/embed")) {
    return null;
  }

  return (
    <EmbedConfigProvider mode="site">
      <ChatWidgetProvider />
    </EmbedConfigProvider>
  );
}
