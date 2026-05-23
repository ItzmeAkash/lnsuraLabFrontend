"use client";

import { CHAT_ACCEPTED_FILE_TYPES } from "@/lib/chat-types";
import { FormEvent, useRef } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
  canSend?: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onFilesSelected,
  disabled = false,
  canSend = false,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="px-3 pb-2">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept={CHAT_ACCEPTED_FILE_TYPES}
        onChange={(e) => {
          if (e.target.files?.length) {
            onFilesSelected(e.target.files);
            e.target.value = "";
          }
        }}
      />

      <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-2 py-2 shadow-sm">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          aria-label="Attach document"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-40"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a message..."
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus-visible:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSend || disabled}
          aria-label="Send message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-300 disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
