import { ChatAttachment, formatFileSize } from "@/lib/chat-types";
import Image from "next/image";

type ChatUserMessageProps = {
  text: string;
  attachments?: ChatAttachment[];
};

function isImageType(type: string) {
  return type.startsWith("image/");
}

export function ChatUserMessage({ text, attachments }: ChatUserMessageProps) {
  return (
    <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1">
      <div className="flex flex-col items-end gap-2">
        {attachments?.map((file) =>
          isImageType(file.type) ? (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-2xl border border-brand/30"
            >
              <Image
                src={file.url}
                alt={file.name}
                width={200}
                height={140}
                className="max-h-36 w-auto object-cover"
                unoptimized
              />
            </a>
          ) : (
            <a
              key={file.id}
              href={file.url}
              download={file.name}
              className="flex items-center gap-2 rounded-2xl bg-brand/90 px-3 py-2 text-xs text-white hover:bg-brand"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              <span className="max-w-[160px] truncate font-medium">{file.name}</span>
              <span className="text-white/70">{formatFileSize(file.size)}</span>
            </a>
          ),
        )}
        {text ? (
          <div className="rounded-2xl bg-brand px-4 py-2.5 text-sm leading-relaxed text-white">
            {text}
          </div>
        ) : null}
      </div>
      <span className="pr-1 text-[11px] text-neutral-400">Read</span>
    </div>
  );
}
