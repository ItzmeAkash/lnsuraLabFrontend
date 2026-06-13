import { InsuraChatEmbedPage } from "@/components/embed/insura-chat-embed-page";
import { Suspense } from "react";

export default function EmbedChatPage() {
  return (
    <Suspense fallback={null}>
      <InsuraChatEmbedPage />
    </Suspense>
  );
}
