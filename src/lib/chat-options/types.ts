import type { ChatFlowOption } from "@/lib/chat-types";

export type OptionRowProps = {
  option: ChatFlowOption;
  index: number;
  disabled: boolean;
  onSelect: (option: ChatFlowOption) => void;
};
