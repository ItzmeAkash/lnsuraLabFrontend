/** Outgoing WebSocket payloads */
export type ChatWsClientMessage =
  | {
      type: "init";
      session_id: string;
      chatbot_name?: string;
      broker_name?: string;
    }
  | { type: "message"; content: string }
  | { type: "flow_select"; option_id: string }
  | {
      type: "document_upload";
      document_type?: string;
      file_name: string;
      mime_type: string;
      content_base64: string;
    }
  | { type: "extraction_submit"; fields: Record<string, string> }
  | { type: "clear" }
  | { type: "ping" };

export type ChatWsFlowOption = {
  id: string;
  label: string;
};

export type ChatWsExtractionField = {
  key: string;
  label: string;
  value: string;
  editable: boolean;
};

export type ChatWsUiBlock = {
  block_type: string;
  title?: string;
  message?: string;
  url: string;
  button_label?: string;
};

export type ChatWsFlowStep = {
  type: "flow_step";
  flow_id: string;
  step_id: string;
  messages: string[];
  options: ChatWsFlowOption[];
  expects: "text" | "option" | "none" | "document" | "extraction_review";
  llm_mode: boolean;
  document_type?: string | null;
  ui_blocks?: ChatWsUiBlock[];
};

export type ChatWsExtractionResult = {
  type: "extraction_result";
  document_type: string;
  fields: ChatWsExtractionField[];
};

export type ChatWsPipelineStepId = "upload" | "analyze" | "extract" | "complete";

export type ChatWsPipelineProgress = {
  type: "pipeline_progress";
  step: ChatWsPipelineStepId;
  status: "active" | "completed";
  message?: string;
};

/** Incoming WebSocket payloads */
export type ChatWsServerMessage =
  | ChatWsFlowStep
  | ChatWsExtractionResult
  | ChatWsPipelineProgress
  | { type: "chunk"; content: string }
  | { type: "message"; role: string; content: string }
  | { type: "done" }
  | { type: "error"; message: string }
  | { type: "pong" }
  | { type: "cleared" }
  | { type: "session"; session_id: string };

export type ChatWsConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type ChatWsFlowExpects =
  | "text"
  | "option"
  | "none"
  | "document"
  | "extraction_review"
  | null;

export function parseChatWsServerMessage(raw: string): ChatWsServerMessage | null {
  try {
    const data = JSON.parse(raw) as ChatWsServerMessage;
    if (typeof data === "object" && data !== null && "type" in data) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
