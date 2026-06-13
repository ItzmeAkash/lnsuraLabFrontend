import {
  DEFAULT_BROKER_NAME,
  DEFAULT_CHATBOT_NAME,
} from "@/lib/embed/defaults";
import type { ChatMessage } from "@/lib/chat-types";

export function resolveChatbotName(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed || DEFAULT_CHATBOT_NAME;
}

export function resolveBrokerName(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed || DEFAULT_BROKER_NAME;
}

export function buildInitialChatMessages(
  chatbotName: string,
  brokerName: string,
): ChatMessage[] {
  return [
    {
      id: "welcome-intro",
      from: "agent",
      text: `Hi there! My name is ${chatbotName} from ${brokerName}, your AI insurance assistant. I will be happy to assist you with your insurance requirements.`,
    },
    {
      id: "welcome-name",
      from: "agent",
      text: "Before we proceed, may I know your name?",
    },
  ];
}
