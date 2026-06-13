import type { ReactNode } from "react";
import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";
import { ChatLinkCard } from "@/components/chat/chat-link-card";
import { ChatMessageText } from "@/components/chat/chat-message-text";
import { ChatUiBlocks } from "@/components/chat/chat-ui-blocks";
import type { ChatUiBlock } from "@/lib/chat-types";
import { extractStandaloneUrl } from "@/lib/parse-message-url";

type ChatAgentMessageProps = {
  text: string;
  uiBlocks?: ChatUiBlock[];
};

function AgentMessageContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-0 w-full max-w-[85%] flex-col gap-3">
      {children}
    </div>
  );
}

export function ChatAgentMessage({ text, uiBlocks }: ChatAgentMessageProps) {
  const hasText = Boolean(text.trim());
  const hasBlocks = Boolean(uiBlocks && uiBlocks.length > 0);
  const standaloneUrl = hasBlocks ? null : extractStandaloneUrl(text);

  if (standaloneUrl) {
    return (
      <div className="flex items-start gap-2.5">
        <ChatAgentAvatar size="sm" showStatus={false} />
        <AgentMessageContent>
          <ChatLinkCard url={standaloneUrl} />
        </AgentMessageContent>
      </div>
    );
  }

  if (!hasText && !hasBlocks) return null;

  return (
    <div className="flex items-start gap-2.5">
      <ChatAgentAvatar size="sm" showStatus={false} />
      <AgentMessageContent>
        {hasText ? (
          <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-neutral-800 shadow-sm">
            <ChatMessageText text={text} />
          </div>
        ) : null}
        {hasBlocks ? <ChatUiBlocks blocks={uiBlocks!} /> : null}
      </AgentMessageContent>
    </div>
  );
}
