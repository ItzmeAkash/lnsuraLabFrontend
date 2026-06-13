"use client";

import { getApiBaseUrl } from "@/lib/api/config";
import {
  DEFAULT_BROKER_NAME,
  DEFAULT_CHATBOT_NAME,
} from "@/lib/embed/defaults";
import type { EmbedMode, InsuraChatEmbedConfig } from "@/lib/embed/types";
import {
  resolveBrokerName,
  resolveChatbotName,
} from "@/lib/chat-greeting";
import { createContext, useContext, useEffect, useMemo } from "react";

const defaultConfig: InsuraChatEmbedConfig = {
  host: "",
  apiBaseUrl: "",
  mode: "site",
  chatbotName: DEFAULT_CHATBOT_NAME,
  brokerName: DEFAULT_BROKER_NAME,
  partnerId: "",
};

const EmbedConfigContext = createContext<InsuraChatEmbedConfig>(defaultConfig);

type EmbedConfigProviderProps = {
  children: React.ReactNode;
  mode?: EmbedMode;
  /** Override from embed URL or script data attributes */
  chatbotName?: string | null;
  brokerName?: string | null;
  partnerId?: string | null;
};

export function EmbedConfigProvider({
  children,
  mode = "site",
  chatbotName: chatbotNameProp,
  brokerName: brokerNameProp,
  partnerId: partnerIdProp,
}: EmbedConfigProviderProps) {
  useEffect(() => {
    if (mode !== "embed") return;
    document.documentElement.classList.add("embed-route");
    document.body.classList.add("embed-route");
    return () => {
      document.documentElement.classList.remove("embed-route");
      document.body.classList.remove("embed-route");
    };
  }, [mode]);

  const value = useMemo<InsuraChatEmbedConfig>(
    () => ({
      host:
        typeof window !== "undefined" ? window.location.origin : "",
      apiBaseUrl: getApiBaseUrl(),
      mode,
      chatbotName: resolveChatbotName(chatbotNameProp),
      brokerName: resolveBrokerName(brokerNameProp),
      partnerId: partnerIdProp?.trim() ?? "",
    }),
    [mode, chatbotNameProp, brokerNameProp, partnerIdProp],
  );

  return (
    <EmbedConfigContext.Provider value={value}>
      {children}
    </EmbedConfigContext.Provider>
  );
}

export function useEmbedConfig() {
  return useContext(EmbedConfigContext);
}
