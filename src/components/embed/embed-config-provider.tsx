"use client";

import { getApiBaseUrl } from "@/lib/api/config";
import type { EmbedMode, InsuraChatEmbedConfig } from "@/lib/embed/types";
import { createContext, useContext, useEffect, useMemo } from "react";

const defaultConfig: InsuraChatEmbedConfig = {
  host: "",
  apiBaseUrl: "",
  mode: "site",
};

const EmbedConfigContext = createContext<InsuraChatEmbedConfig>(defaultConfig);

type EmbedConfigProviderProps = {
  children: React.ReactNode;
  mode?: EmbedMode;
};

export function EmbedConfigProvider({
  children,
  mode = "site",
}: EmbedConfigProviderProps) {
  useEffect(() => {
    if (mode !== "embed") return;
    document.body.classList.add("embed-route");
    return () => {
      document.body.classList.remove("embed-route");
    };
  }, [mode]);

  const value = useMemo<InsuraChatEmbedConfig>(
    () => ({
      host:
        typeof window !== "undefined" ? window.location.origin : "",
      apiBaseUrl: getApiBaseUrl(),
      mode,
    }),
    [mode],
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
