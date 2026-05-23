import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";

const DOT_DELAYS = ["0ms", "200ms", "400ms"] as const;

export function ChatTypingIndicator() {
  return (
    <div className="flex items-end gap-2.5" aria-label="Insura is typing">
      <ChatAgentAvatar size="sm" showStatus={false} />
      <div
        className="flex min-h-[44px] min-w-[52px] items-center justify-center gap-1.5 rounded-2xl bg-white px-4 py-3 shadow-sm"
        role="status"
      >
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="chat-typing-dot"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}
