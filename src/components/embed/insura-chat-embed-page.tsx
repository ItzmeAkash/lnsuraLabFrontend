"use client";

import { ChatWidgetProvider } from "@/components/chat/chat-widget-provider";
import { EmbedConfigProvider } from "@/components/embed/embed-config-provider";

export function InsuraChatEmbedPage() {
  return (
    <EmbedConfigProvider mode="embed">
      <ChatWidgetProvider />
    </EmbedConfigProvider>
  );
}
