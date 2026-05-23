"use client";

import { ChatAgentMessage } from "@/components/chat/chat-agent-message";
import { ChatAttachmentPreview } from "@/components/chat/chat-attachment-preview";
import { ChatFooter } from "@/components/chat/chat-footer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator";
import { ChatUserMessage } from "@/components/chat/chat-user-message";
import { useEmbedConfig } from "@/components/embed/embed-config-provider";
import { cn } from "@/lib/cn";
import {
  CHAT_MAX_FILE_SIZE_MB,
  ChatAttachment,
  ChatMessage,
} from "@/lib/chat-types";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

const WELCOME_MESSAGE =
  "Welcome to Insura! How can we help you with insurance quotes or broker tools today?";

const AGENT_REPLY =
  "Thanks for your message! Our team will reply shortly.";

const AGENT_REPLY_WITH_FILE =
  "We received your document. Our team will review it and get back to you shortly.";

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

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { mode } = useEmbedConfig();
  const isEmbed = mode === "embed";
  const positionClass = isEmbed
    ? "right-4 bottom-4"
    : "right-5 bottom-24 sm:right-8 sm:bottom-28";

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", text: WELCOME_MESSAGE, from: "agent" },
  ]);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<ChatAttachment[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const attachmentUrlsRef = useRef<Set<string>>(new Set());

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
    if (open && !minimized) scrollToBottom();
  }, [messages, isTyping, open, minimized, pendingFiles]);

  useEffect(() => {
    const urls = attachmentUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const handleClose = () => {
    setMinimized(false);
    setIsTyping(false);
    setPendingFiles([]);
    onClose();
  };

  const handleFilesSelected = (fileList: FileList) => {
    const incoming = filesToAttachments(Array.from(fileList));
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

  const canSend = Boolean(input.trim() || pendingFiles.length > 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend || isTyping) return;

    const text = input.trim();
    const attachments = pendingFiles.length > 0 ? [...pendingFiles] : undefined;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, text, from: "user", attachments },
    ]);
    setInput("");
    setPendingFiles([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          text: attachments?.length ? AGENT_REPLY_WITH_FILE : AGENT_REPLY,
          from: "agent",
        },
      ]);
    }, 1400);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Chat with Insura"
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
          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4"
          >
            {messages.map((msg) =>
              msg.from === "agent" ? (
                <ChatAgentMessage key={msg.id} text={msg.text} />
              ) : (
                <ChatUserMessage
                  key={msg.id}
                  text={msg.text}
                  attachments={msg.attachments}
                />
              ),
            )}
            {isTyping && <ChatTypingIndicator />}
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
            disabled={isTyping}
            canSend={canSend}
          />
          <ChatFooter />
        </>
      )}
    </div>
  );
}
