export const INSURA_CHAT_RESIZE_MESSAGE = "insura-chat:resize" as const;

export type InsuraChatResizeMessage = {
  type: typeof INSURA_CHAT_RESIZE_MESSAGE;
  width: number;
  height: number;
};

/** Matches launcher (64px) + padding + pulse ring overflow in embed iframe */
const COLLAPSED_SIZE = 112;
const EXPANDED_WIDTH = 420;
const EXPANDED_MAX_HEIGHT = 720;

/** Iframe footprint: small launcher when closed, full panel when open. */
export function getEmbedIframeSize(open: boolean): {
  width: number;
  height: number;
} {
  if (!open) {
    return { width: COLLAPSED_SIZE, height: COLLAPSED_SIZE };
  }

  const height =
    typeof window !== "undefined"
      ? Math.min(EXPANDED_MAX_HEIGHT, window.innerHeight)
      : EXPANDED_MAX_HEIGHT;

  return { width: EXPANDED_WIDTH, height };
}

export function postEmbedResizeToParent(width: number, height: number) {
  if (typeof window === "undefined" || window.parent === window) return;

  const message: InsuraChatResizeMessage = {
    type: INSURA_CHAT_RESIZE_MESSAGE,
    width,
    height,
  };

  window.parent.postMessage(message, "*");
}
