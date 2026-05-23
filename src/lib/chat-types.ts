export type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "agent";
  attachments?: ChatAttachment[];
};

export const CHAT_ACCEPTED_FILE_TYPES =
  ".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp";

export const CHAT_MAX_FILE_SIZE_MB = 10;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
