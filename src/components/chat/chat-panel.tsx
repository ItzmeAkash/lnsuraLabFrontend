"use client";

import { ChatAgentMessage } from "@/components/chat/chat-agent-message";
import { ChatAttachmentPreview } from "@/components/chat/chat-attachment-preview";
import { ChatConnectionBanner } from "@/components/chat/chat-connection-banner";
import { ChatFooter } from "@/components/chat/chat-footer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatDocumentPipeline } from "@/components/chat/chat-document-pipeline";
import { ChatExtractionReview } from "@/components/chat/chat-extraction-review";
import { ChatOptionButtons } from "@/components/chat/chat-option-buttons";
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator";
import { ChatUserMessage } from "@/components/chat/chat-user-message";
import { useEmbedConfig } from "@/components/embed/embed-config-provider";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import type {
  ChatWsExtractionField,
  ChatWsExtractionResult,
  ChatWsFlowStep,
} from "@/lib/api/chat-ws-types";
import { cn } from "@/lib/cn";
import {
  CHAT_MAX_FILE_SIZE_MB,
  ChatAttachment,
  ChatFlowOption,
  ChatMessage,
  ChatUiBlock,
} from "@/lib/chat-types";
import {
  extractStandaloneUrl,
  getLinkButtonLabel,
  getLinkCardDescription,
  getLinkCardTitle,
} from "@/lib/parse-message-url";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

const FILE_ATTACH_NOTICE =
  "File attachments are not supported yet. Please describe your document in a message.";

function filesToAttachments(files: File[]): ChatAttachment[] {
  const maxBytes = CHAT_MAX_FILE_SIZE_MB * 1024 * 1024;
  return files
    .filter((file) => file.size <= maxBytes)
    .map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
}

function isDocumentUploadAckMessage(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return (
    normalized === "document upload successfully" ||
    normalized === "document uploaded successfully" ||
    normalized === "document upload successful"
  );
}

function flowStepToMessages(step: ChatWsFlowStep): ChatMessage[] {
  const filteredMessages = step.messages.filter(
    (text) => !isDocumentUploadAckMessage(text),
  );

  const stepUiBlocks: ChatUiBlock[] = (step.ui_blocks ?? []).map((block) => ({
    block_type: block.block_type,
    title: block.title,
    message: block.message,
    url: block.url,
    button_label: block.button_label,
  }));

  const linkBlocks: ChatUiBlock[] = [];
  const textMessages: string[] = [];

  for (const text of filteredMessages) {
    const url = extractStandaloneUrl(text);
    if (url) {
      linkBlocks.push({
        block_type: "link",
        url,
        title: getLinkCardTitle(url),
        message: getLinkCardDescription(url),
        button_label: getLinkButtonLabel(url),
      });
      continue;
    }
    textMessages.push(text);
  }

  const allUiBlocks = [...stepUiBlocks, ...linkBlocks];

  if (textMessages.length === 0 && allUiBlocks.length > 0) {
    return [
      {
        id: `flow-${step.flow_id}-${step.step_id}-link-${Date.now()}`,
        text: "",
        from: "agent",
        options: step.options.length > 0 ? step.options : undefined,
        uiBlocks: allUiBlocks,
      },
    ];
  }

  if (textMessages.length === 0) return [];

  const agentMessages: ChatMessage[] = textMessages.map((text, index) => ({
    id: `flow-${step.flow_id}-${step.step_id}-${index}-${Date.now()}`,
    text,
    from: "agent" as const,
    options:
      index === textMessages.length - 1 && step.options.length > 0
        ? step.options
        : undefined,
  }));

  if (allUiBlocks.length > 0) {
    const lastMessage = agentMessages.at(-1);
    if (lastMessage) {
      lastMessage.uiBlocks = allUiBlocks;
    }
  }

  return agentMessages;
}

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { mode, chatbotName, brokerName } = useEmbedConfig();
  const isEmbed = mode === "embed";
  const positionClass = isEmbed
    ? "right-4 bottom-4"
    : "right-5 bottom-24 sm:right-8 sm:bottom-28";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<ChatAttachment[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [activeOptions, setActiveOptions] = useState<ChatFlowOption[]>([]);
  const [extractionFields, setExtractionFields] = useState<ChatWsExtractionField[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const attachmentUrlsRef = useRef<Set<string>>(new Set());

  const chatVisible = open && !minimized;

  const handleFlowStep = useCallback((step: ChatWsFlowStep) => {
    if (step.expects !== "extraction_review") {
      setExtractionFields([]);
    }
    setMessages((prev) => [
      ...prev.map((message) => ({ ...message, options: undefined })),
      ...flowStepToMessages(step),
    ]);
    setActiveOptions(step.options);
  }, []);

  const handleExtractionResult = useCallback((result: ChatWsExtractionResult) => {
    setExtractionFields(result.fields);
  }, []);

  const handleCleared = useCallback(() => {
    setMessages([]);
    setActiveOptions([]);
    setExtractionFields([]);
  }, []);

  const {
    connectionStatus,
    streamingText,
    isResponding,
    lastError,
    flowExpects,
    llmMode,
    sendMessage,
    sendDocumentUpload,
    submitExtraction,
    selectFlowOption,
    clearChat,
    documentPipeline,
    isReady,
  } = useChatWebSocket({
    enabled: open,
    chatbotName,
    brokerName,
    onFlowStep: handleFlowStep,
    onExtractionResult: handleExtractionResult,
    onCleared: handleCleared,
  });

  const trackUrl = (url: string) => attachmentUrlsRef.current.add(url);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    if (chatVisible) scrollToBottom();
  }, [
    messages,
    isResponding,
    streamingText,
    chatVisible,
    pendingFiles,
    activeOptions,
    documentPipeline,
    extractionFields,
  ]);

  useEffect(() => {
    const urls = attachmentUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const handleClose = () => {
    clearChat();
    setMinimized(false);
    setPendingFiles([]);
    setMessages([]);
    setActiveOptions([]);
    setExtractionFields([]);
    onClose();
  };

  const handleFilesSelected = async (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (flowExpects === "document") {
      const file = files[0];
      setMessages((prev) => [
        ...prev.map((message) => ({ ...message, options: undefined })),
        {
          id: `user-file-${Date.now()}`,
          text: "Document Upload successfully",
          from: "user",
        },
      ]);
      setActiveOptions([]);

      try {
        await sendDocumentUpload(file);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload document";
        setMessages((prev) => [
          ...prev,
          { id: `agent-err-${Date.now()}`, text: message, from: "agent" },
        ]);
      }
      return;
    }

    const incoming = filesToAttachments(files);
    incoming.forEach((a) => trackUrl(a.url));

    setPendingFiles((prev) => {
      const existing = new Set(prev.map((f) => f.id));
      const merged = [...prev];
      for (const file of incoming) {
        if (!existing.has(file.id)) merged.push(file);
      }
      return merged;
    });
  };

  const removePendingFile = (id: string) => {
    setPendingFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const hasText = Boolean(input.trim());
  const hasFiles = pendingFiles.length > 0;
  const canSend =
    hasText &&
    isReady &&
    !isResponding &&
    (llmMode || flowExpects === "text");

  const handleExtractionSubmit = async (fields: Record<string, string>) => {
    if (!isReady || isResponding) return;

    try {
      await submitExtraction(fields);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        { id: `agent-err-${Date.now()}`, text: message, from: "agent" },
      ]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isResponding) return;

    if (hasFiles) {
      setMessages((prev) => [
        ...prev,
        { id: `agent-file-${Date.now()}`, text: FILE_ATTACH_NOTICE, from: "agent" },
      ]);
      return;
    }

    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev.map((message) => ({ ...message, options: undefined })),
      { id: `user-${Date.now()}`, text, from: "user" },
    ]);
    setInput("");
    setActiveOptions([]);

    try {
      const reply = await sendMessage(text);
      if (typeof reply === "string" && reply.trim()) {
        setMessages((prev) => [
          ...prev,
          { id: `agent-${Date.now()}`, text: reply, from: "agent" },
        ]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        { id: `agent-err-${Date.now()}`, text: message, from: "agent" },
      ]);
    }
  };

  const handleOptionSelect = async (option: ChatFlowOption) => {
    if (!isReady || isResponding) return;

    setMessages((prev) => [
      ...prev.map((message) => ({ ...message, options: undefined })),
      { id: `user-${Date.now()}`, text: option.label, from: "user" },
    ]);
    setActiveOptions([]);

    try {
      await selectFlowOption(option.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        { id: `agent-err-${Date.now()}`, text: message, from: "agent" },
      ]);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={`Chat with ${chatbotName}`}
      className={cn(
        "fixed z-[100] flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#f0f0f0] transition-all duration-300 ease-out",
        isEmbed
          ? "shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
          : "shadow-[0_16px_56px_rgba(0,0,0,0.45)]",
        positionClass,
        minimized ? "h-auto" : "h-[min(560px,calc(100vh-10rem))]",
      )}
    >
      <ChatHeader
        minimized={minimized}
        onMinimize={() => setMinimized((prev) => !prev)}
        onClose={handleClose}
      />

      {!minimized && (
        <>
          <ChatConnectionBanner status={connectionStatus} error={lastError} />

          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4"
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-3">
                {msg.from === "agent" ? (
                  <ChatAgentMessage text={msg.text} uiBlocks={msg.uiBlocks} />
                ) : (
                  <ChatUserMessage
                    text={msg.text}
                    attachments={msg.attachments}
                  />
                )}
              </div>
            ))}
            {activeOptions.length > 0 && (
              <ChatOptionButtons
                options={activeOptions}
                disabled={!isReady || isResponding || flowExpects !== "option"}
                onSelect={handleOptionSelect}
              />
            )}
            {documentPipeline.active && (
              <ChatDocumentPipeline pipeline={documentPipeline} />
            )}
            {flowExpects === "extraction_review" && extractionFields.length > 0 && (
              <ChatExtractionReview
                fields={extractionFields}
                disabled={!isReady || isResponding}
                onSubmit={handleExtractionSubmit}
              />
            )}
            {isResponding && !streamingText && !documentPipeline.active && (
              <ChatTypingIndicator />
            )}
            {streamingText && !documentPipeline.active ? (
              <ChatAgentMessage text={streamingText} />
            ) : null}
          </div>

          <ChatAttachmentPreview
            attachments={pendingFiles}
            onRemove={removePendingFile}
          />
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onFilesSelected={handleFilesSelected}
            autoFocus={chatVisible}
            disabled={
              isResponding ||
              connectionStatus === "connecting" ||
              flowExpects === "extraction_review"
            }
            canSend={canSend}
          />
          <ChatFooter />
        </>
      )}
    </div>
  );
}
