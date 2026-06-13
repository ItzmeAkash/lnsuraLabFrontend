import { ChatAgentAvatar } from "@/components/chat/chat-agent-avatar";
import { StandardListRow } from "@/components/chat/options/standard-list-row";
import type { ChatFlowOption } from "@/lib/chat-types";

type ChatOptionButtonsProps = {
  options: ChatFlowOption[];
  disabled?: boolean;
  onSelect: (option: ChatFlowOption) => void;
};

export function ChatOptionButtons({
  options,
  disabled = false,
  onSelect,
}: ChatOptionButtonsProps) {
  if (options.length === 0) return null;

  return (
    <div
      className="flex items-start gap-2.5"
      role="group"
      aria-label="Choose an option"
    >
      <ChatAgentAvatar size="sm" showStatus={false} />
      <div className="flex min-w-0 w-full max-w-[85%] flex-col gap-1">
        {options.map((option, index) => (
          <StandardListRow
            key={option.id}
            option={option}
            index={index}
            disabled={disabled}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
