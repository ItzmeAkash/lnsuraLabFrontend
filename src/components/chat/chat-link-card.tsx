import { cn } from "@/lib/cn";
import {
  getLinkButtonLabel,
  getLinkCardDescription,
  getLinkCardTitle,
} from "@/lib/parse-message-url";

type ChatLinkCardProps = {
  url: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
};

function ExternalLinkIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ChatLinkCard({
  url,
  title,
  description,
  buttonLabel,
  className,
}: ChatLinkCardProps) {
  const cardTitle = title ?? getLinkCardTitle(url);
  const cardDescription = description ?? getLinkCardDescription(url);
  const label = buttonLabel ?? getLinkButtonLabel(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block w-full rounded-2xl border border-[#1d70f1]/20 bg-white p-4 shadow-sm transition-all hover:border-[#1d70f1]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d70f1]/50",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d70f1]/10 text-[#1d70f1] transition-colors group-hover:bg-[#1d70f1]/15">
          <ExternalLinkIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-neutral-900">
            {cardTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            {cardDescription}
          </p>
        </div>
        <ChevronIcon />
      </div>

      <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d70f1] px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-[#1a65db]">
        <span>{label}</span>
        <ExternalLinkIcon />
      </div>
    </a>
  );
}
