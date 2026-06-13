export type EmbedMode = "site" | "embed";

export type InsuraChatEmbedConfig = {
  /** Where this Next.js app is hosted (for embed iframe) */
  host: string;
  /** Internal backend — from NEXT_PUBLIC_API_URL only */
  apiBaseUrl: string;
  mode: EmbedMode;
  /** Display name for the AI assistant */
  chatbotName: string;
  /** Partner / broker business name */
  brokerName: string;
  /** Partner id — used server-side to pick CHAT_API_KEY_<PARTNER_ID> from .env */
  partnerId: string;
};
