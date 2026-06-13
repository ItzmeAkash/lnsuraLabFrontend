import {
  getChatApiKey,
  getChatSessionsUrl,
} from "@/lib/api/chat-server-config";
import { NextResponse } from "next/server";

export type ChatSessionResponse = {
  session_id: string;
  partner_id?: string;
};

/**
 * Exchange server-side CHAT_API_KEY for a short-lived session_id.
 * Browser never sees the API key.
 */
export async function POST(request: Request) {
  let partnerId = "";
  try {
    const body = (await request.json()) as { partner_id?: string };
    partnerId = body.partner_id?.trim() ?? "";
  } catch {
    // Empty body is fine — uses default CHAT_API_KEY
  }

  const sessionsUrl = getChatSessionsUrl();
  const apiKey = getChatApiKey(partnerId || undefined);

  if (!sessionsUrl || !apiKey) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured. Set CHAT_API_URL and CHAT_API_KEY in .env.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(sessionsUrl, {
      method: "POST",
      headers: {
        "X-Chat-Api-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const status = res.status === 401 || res.status === 403 ? 401 : 502;
      return NextResponse.json(
        { error: status === 401 ? "Unauthorized" : "Chat session failed" },
        { status },
      );
    }

    const data = (await res.json()) as ChatSessionResponse;
    if (!data.session_id) {
      return NextResponse.json(
        { error: "Invalid session response from chat server" },
        { status: 502 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not reach chat server" },
      { status: 502 },
    );
  }
}
