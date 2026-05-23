import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";
import { ChatToolbarButton } from "@/components/chat/chat-toolbar-button";

type ChatHeaderProps = {
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
};

export function ChatHeader({
  minimized,
  onMinimize,
  onClose,
}: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-3 py-3">
      <ChatAgentAvatar size="md" priority />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-tight text-neutral-900">Insura</p>
        <p className="text-xs text-neutral-500">AI assistant</p>
      </div>

      <div className="flex shrink-0 gap-1">
        <ChatToolbarButton
          label={minimized ? "Restore chat" : "Minimize"}
          onClick={onMinimize}
          className="bg-neutral-100 shadow-none hover:bg-neutral-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </ChatToolbarButton>
        <ChatToolbarButton
          label="Close chat"
          onClick={onClose}
          className="bg-neutral-100 shadow-none hover:bg-neutral-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </ChatToolbarButton>
      </div>
    </header>
  );
}
