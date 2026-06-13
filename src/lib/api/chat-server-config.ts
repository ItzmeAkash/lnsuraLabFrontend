/**
 * Server-only chat config. API key and backend URL never reach the browser.
 */

const CHAT_WS_PATH = "/api/v1/chat";
const CHAT_SESSIONS_PATH = "/api/v1/chat/sessions";

export function getChatApiUrl(): string {
  return (
    process.env.CHAT_API_URL?.trim() ??
    process.env.NEXT_PUBLIC_API_URL?.trim() ??
    ""
  );
}

function normalizePartnerEnvKey(partnerId: string): string {
  return partnerId
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toUpperCase();
}

/** Resolve API key: CHAT_API_KEY_<PARTNER_ID> first, then CHAT_API_KEY fallback. */
export function getChatApiKey(partnerId?: string): string {
  const normalized = partnerId?.trim();
  if (normalized) {
    const envName = `CHAT_API_KEY_${normalizePartnerEnvKey(normalized)}`;
    const partnerKey = process.env[envName]?.trim();
    if (partnerKey) return partnerKey;
  }
  return process.env.CHAT_API_KEY?.trim() ?? "";
}

export function getChatSessionsUrl(): string {
  const base = getChatApiUrl().replace(/\/$/, "");
  if (!base) return "";
  return `${base}${CHAT_SESSIONS_PATH}`;
}

/** Clean WebSocket URL — no api_key query param */
export function buildChatWebSocketUrl(): string {
  const override = process.env.NEXT_PUBLIC_CHAT_WS_URL?.trim();
  if (override) {
    try {
      const url = new URL(override);
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return override;
    }
  }

  const base = getChatApiUrl();
  if (!base) return "";

  try {
    const url = new URL(base);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = CHAT_WS_PATH;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}
