export type EmbedMode = "site" | "embed";

export type InsuraChatEmbedConfig = {
  /** Where this Next.js app is hosted (for embed iframe) */
  host: string;
  /** Internal backend — from NEXT_PUBLIC_API_URL only */
  apiBaseUrl: string;
  mode: EmbedMode;
};
