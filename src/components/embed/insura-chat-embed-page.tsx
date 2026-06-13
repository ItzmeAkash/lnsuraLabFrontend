"use client";

import { ChatWidgetProvider } from "@/components/chat/chat-widget-provider";
import { EmbedConfigProvider } from "@/components/embed/embed-config-provider";
import { useSearchParams } from "next/navigation";

export function InsuraChatEmbedPage() {
  const searchParams = useSearchParams();

  const chatbotName =
    searchParams.get("chatbot") ??
    searchParams.get("chatbot-name") ??
    searchParams.get("chatbotName");
  const brokerName =
    searchParams.get("broker") ??
    searchParams.get("broker-name") ??
    searchParams.get("brokerName");

  return (
    <EmbedConfigProvider
      mode="embed"
      chatbotName={chatbotName}
      brokerName={brokerName}
    >
      <ChatWidgetProvider />
    </EmbedConfigProvider>
  );
}
