import type { ChatWsConnectionStatus } from "@/lib/api/chat-ws-types";
import { cn } from "@/lib/cn";

type ChatConnectionBannerProps = {
  status: ChatWsConnectionStatus;
  error?: string | null;
};

export function ChatConnectionBanner({
  status,
  error,
}: ChatConnectionBannerProps) {
  if (status === "connected") return null;

  const message =
    status === "connecting"
      ? "Connecting to Insura…"
      : status === "error" || status === "disconnected"
        ? error ?? "Unable to reach chat server"
        : null;

  if (!message) return null;

  return (
    <div
      className={cn(
        "shrink-0 border-b px-3 py-2 text-center text-xs",
        status === "connecting"
          ? "border-amber-200/80 bg-amber-50 text-amber-800"
          : "border-red-200/80 bg-red-50 text-red-700",
      )}
      role="status"
    >
      {message}
    </div>
  );
}
