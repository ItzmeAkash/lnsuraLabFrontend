import { ChatAttachment, formatFileSize } from "@/lib/chat-types";

type ChatAttachmentPreviewProps = {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
};

export function ChatAttachmentPreview({
  attachments,
  onRemove,
}: ChatAttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {attachments.map((file) => (
        <div
          key={file.id}
          className="flex max-w-full items-center gap-2 rounded-full border border-neutral-300 bg-white py-1 pr-1 pl-3 text-xs text-neutral-700 shadow-sm"
        >
          <span className="truncate">{file.name}</span>
          <span className="shrink-0 text-neutral-400">
            ({formatFileSize(file.size)})
          </span>
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name}`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
