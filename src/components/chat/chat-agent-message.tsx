import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";

type ChatAgentMessageProps = {
  text: string;
};

export function ChatAgentMessage({ text }: ChatAgentMessageProps) {
  return (
    <div className="flex items-start gap-2.5">
      <ChatAgentAvatar size="sm" showStatus={false} />
      <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-neutral-800 shadow-sm">
        {text}
      </div>
    </div>
  );
}
