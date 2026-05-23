/**
 * Internal API URL — set once in .env on your server.
 * Never exposed to partner sites in the embed script.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}
