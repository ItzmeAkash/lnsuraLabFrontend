import { buildChatWebSocketUrl } from "@/lib/api/chat-server-config";
import { NextResponse } from "next/server";

/** Returns the clean WebSocket URL (no secrets). */
export async function GET() {
  const url = buildChatWebSocketUrl();

  if (!url) {
    return NextResponse.json(
      {
        error:
          "Chat is not configured. Set CHAT_API_URL in .env.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ url });
}
