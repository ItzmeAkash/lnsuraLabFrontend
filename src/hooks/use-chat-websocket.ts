"use client";

import {
  type ChatWsConnectionStatus,
  type ChatWsExtractionResult,
  type ChatWsFlowExpects,
  type ChatWsFlowStep,
  type ChatWsPipelineProgress,
  parseChatWsServerMessage,
} from "@/lib/api/chat-ws-types";
import {
  INACTIVE_PIPELINE,
  type DocumentPipelineState,
  pipelineAfterUpload,
  pipelineComplete,
  pipelineDuringExtract,
} from "@/lib/document-pipeline";
import { useCallback, useEffect, useRef, useState } from "react";

const PING_INTERVAL_MS = 30_000;
const SESSION_ENDPOINT = "/api/chat/session";
const WS_URL_ENDPOINT = "/api/chat/ws-url";

type PendingReply = {
  chunks: string;
  resolve: (content: string) => void;
  reject: (error: Error) => void;
  settled: boolean;
};

type ChatSession = {
  session_id: string;
  partner_id?: string;
};

type UseChatWebSocketOptions = {
  enabled: boolean;
  chatbotName: string;
  brokerName: string;
  onFlowStep?: (step: ChatWsFlowStep) => void;
  onExtractionResult?: (result: ChatWsExtractionResult) => void;
  onCleared?: () => void;
};

async function fetchChatSession(): Promise<ChatSession> {
  const res = await fetch(SESSION_ENDPOINT, { method: "POST", cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to start chat session");
  }
  const data = (await res.json()) as ChatSession;
  if (!data.session_id) throw new Error("Chat session id is missing");
  return data;
}

async function fetchWebSocketUrl(): Promise<string> {
  const res = await fetch(WS_URL_ENDPOINT, { cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to connect to chat server");
  }
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error("Chat WebSocket URL is missing");
  return data.url;
}

export function useChatWebSocket({
  enabled,
  chatbotName,
  brokerName,
  onFlowStep,
  onExtractionResult,
  onCleared,
}: UseChatWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const pendingRef = useRef<PendingReply | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFlowStepRef = useRef(onFlowStep);
  const onExtractionResultRef = useRef(onExtractionResult);
  const onClearedRef = useRef(onCleared);

  const [connectionStatus, setConnectionStatus] =
    useState<ChatWsConnectionStatus>("idle");
  const [streamingText, setStreamingText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [flowExpects, setFlowExpects] = useState<ChatWsFlowExpects>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [llmMode, setLlmMode] = useState(false);
  const [documentPipeline, setDocumentPipeline] =
    useState<DocumentPipelineState>(INACTIVE_PIPELINE);
  const documentProcessingRef = useRef(false);

  useEffect(() => {
    onFlowStepRef.current = onFlowStep;
  }, [onFlowStep]);

  useEffect(() => {
    onExtractionResultRef.current = onExtractionResult;
  }, [onExtractionResult]);

  useEffect(() => {
    onClearedRef.current = onCleared;
  }, [onCleared]);

  const clearPingTimer = useCallback(() => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const sendInit = useCallback(
    (ws: WebSocket) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;

      ws.send(
        JSON.stringify({
          type: "init",
          session_id: sessionId,
          chatbot_name: chatbotName,
          broker_name: brokerName,
        }),
      );
    },
    [brokerName, chatbotName],
  );

  const settlePending = useCallback((content: string) => {
    const pending = pendingRef.current;
    if (!pending || pending.settled) return;
    pending.settled = true;
    pendingRef.current = null;
    setStreamingText("");
    setIsResponding(false);
    pending.resolve(content);
  }, []);

  const failPending = useCallback((message: string) => {
    const pending = pendingRef.current;
    if (!pending || pending.settled) return;
    pending.settled = true;
    pendingRef.current = null;
    setStreamingText("");
    setIsResponding(false);
    documentProcessingRef.current = false;
    setDocumentPipeline(INACTIVE_PIPELINE);
    pending.reject(new Error(message));
  }, []);

  const applyPipelineProgress = useCallback((event: ChatWsPipelineProgress) => {
    documentProcessingRef.current = true;
    setDocumentPipeline((prev) => {
      const steps = { ...prev.steps };
      const order = ["upload", "analyze", "extract", "complete"] as const;
      const stepIndex = order.indexOf(event.step);

      for (let i = 0; i < order.length; i += 1) {
        if (i < stepIndex) steps[order[i]] = "completed";
        else if (i > stepIndex) steps[order[i]] = "pending";
      }
      steps[event.step] = event.status === "completed" ? "completed" : "active";

      return {
        active: true,
        statusMessage: event.message ?? prev.statusMessage,
        steps,
      };
    });
  }, []);

  const handleServerMessage = useCallback(
    (raw: string) => {
      const data = parseChatWsServerMessage(raw);
      if (!data) return;

      switch (data.type) {
        case "flow_step": {
          const pending = pendingRef.current;
          if (pending && !pending.settled) {
            if (pending.chunks.trim()) {
              settlePending(pending.chunks);
            } else {
              pending.settled = true;
              pendingRef.current = null;
              pending.resolve("");
            }
          }
          setStreamingText("");
          setIsResponding(false);
          documentProcessingRef.current = false;
          setDocumentPipeline(INACTIVE_PIPELINE);
          setFlowExpects(data.expects);
          setDocumentType(data.document_type ?? null);
          setLlmMode(data.llm_mode);
          onFlowStepRef.current?.(data);
          break;
        }
        case "pipeline_progress": {
          applyPipelineProgress(data);
          break;
        }
        case "extraction_result": {
          documentProcessingRef.current = false;
          setDocumentPipeline(pipelineComplete());
          onExtractionResultRef.current?.(data);
          setIsResponding(false);
          window.setTimeout(() => setDocumentPipeline(INACTIVE_PIPELINE), 1200);
          break;
        }
        case "chunk": {
          const pending = pendingRef.current;
          if (!pending || pending.settled) return;
          pending.chunks += data.content;
          setStreamingText(pending.chunks);
          if (documentProcessingRef.current) {
            setDocumentPipeline(pipelineDuringExtract(pending.chunks));
          }
          break;
        }
        case "message": {
          settlePending(data.content);
          break;
        }
        case "done": {
          const pending = pendingRef.current;
          if (pending && !pending.settled) {
            settlePending(pending.chunks);
          }
          break;
        }
        case "error": {
          setLastError(data.message);
          documentProcessingRef.current = false;
          setDocumentPipeline(INACTIVE_PIPELINE);
          failPending(data.message);
          break;
        }
        case "cleared": {
          setFlowExpects(null);
          setDocumentType(null);
          setLlmMode(false);
          documentProcessingRef.current = false;
          setDocumentPipeline(INACTIVE_PIPELINE);
          onClearedRef.current?.();
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            sendInit(wsRef.current);
          }
          break;
        }
        case "pong":
          break;
        default:
          break;
      }
    },
    [applyPipelineProgress, failPending, sendInit, settlePending],
  );

  useEffect(() => {
    if (!enabled) {
      clearPingTimer();
      const pending = pendingRef.current;
      if (pending && !pending.settled) {
        pending.reject(new Error("Chat closed"));
      }
      pendingRef.current = null;
      sessionIdRef.current = null;
      wsRef.current?.close();
      wsRef.current = null;
      setConnectionStatus("idle");
      setStreamingText("");
      setIsResponding(false);
      setFlowExpects(null);
      setDocumentType(null);
      setLlmMode(false);
      documentProcessingRef.current = false;
      setDocumentPipeline(INACTIVE_PIPELINE);
      return;
    }

    let cancelled = false;

    const connect = async () => {
      setConnectionStatus("connecting");
      setLastError(null);

      try {
        const [session, wsUrl] = await Promise.all([
          fetchChatSession(),
          fetchWebSocketUrl(),
        ]);
        if (cancelled) return;

        sessionIdRef.current = session.session_id;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        const isCurrentSocket = () =>
          !cancelled && wsRef.current === ws;

        ws.onopen = () => {
          if (!isCurrentSocket()) return;
          setConnectionStatus("connected");
          sendInit(ws);
          pingTimerRef.current = setInterval(() => {
            if (isCurrentSocket() && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, PING_INTERVAL_MS);
        };

        ws.onmessage = (event) => {
          if (!isCurrentSocket()) return;
          handleServerMessage(String(event.data));
        };

        ws.onerror = () => {
          if (!isCurrentSocket()) return;
          setConnectionStatus("error");
          setLastError("WebSocket connection error");
          failPending("WebSocket connection error");
        };

        ws.onclose = () => {
          if (!isCurrentSocket()) return;
          clearPingTimer();
          wsRef.current = null;
          setConnectionStatus((prev) =>
            prev === "error" ? "error" : "disconnected",
          );
          setFlowExpects(null);
          setDocumentType(null);
          setLlmMode(false);
          failPending("Disconnected from chat server");
        };
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to connect to chat server";
        setConnectionStatus("error");
        setLastError(message);
        failPending(message);
      }
    };

    connect();

    return () => {
      cancelled = true;
      clearPingTimer();
      const ws = wsRef.current;
      if (ws) {
        wsRef.current = null;
        ws.close();
      }
      sessionIdRef.current = null;
      const pending = pendingRef.current;
      if (pending && !pending.settled) {
        pending.reject(new Error("Chat closed"));
      }
      pendingRef.current = null;
    };
  }, [
    brokerName,
    chatbotName,
    clearPingTimer,
    enabled,
    failPending,
    handleServerMessage,
    sendInit,
  ]);

  const sendMessage = useCallback(
    (content: string): Promise<string | void> => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(
          new Error(
            connectionStatus === "connecting"
              ? "Connecting to Insura…"
              : "Not connected to chat server",
          ),
        );
      }

      const awaitsReply = llmMode || flowExpects === "text";

      if (awaitsReply) {
        if (pendingRef.current && !pendingRef.current.settled) {
          return Promise.reject(new Error("Please wait for the current reply"));
        }

        return new Promise<string>((resolve, reject) => {
          pendingRef.current = {
            chunks: "",
            resolve,
            reject,
            settled: false,
          };
          setIsResponding(true);
          setStreamingText("");
          setLastError(null);
          ws.send(JSON.stringify({ type: "message", content }));
        });
      }

      ws.send(JSON.stringify({ type: "message", content }));
      return Promise.resolve();
    },
    [connectionStatus, flowExpects, llmMode],
  );

  const sendDocumentUpload = useCallback(
    async (file: File, documentTypeOverride?: string): Promise<void> => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error("Not connected to chat server"));
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result ?? "");
          const commaIndex = result.indexOf(",");
          resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setIsResponding(true);
      setLastError(null);
      documentProcessingRef.current = true;
      setDocumentPipeline(pipelineAfterUpload());

      ws.send(
        JSON.stringify({
          type: "document_upload",
          document_type: documentTypeOverride ?? documentType ?? "emirates_id",
          file_name: file.name,
          mime_type: file.type || "application/octet-stream",
          content_base64: base64,
        }),
      );
    },
    [documentType],
  );

  const submitExtraction = useCallback((fields: Record<string, string>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("Not connected to chat server"));
    }

    setIsResponding(true);
    ws.send(JSON.stringify({ type: "extraction_submit", fields }));
    return Promise.resolve();
  }, []);

  const selectFlowOption = useCallback((optionId: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("Not connected to chat server"));
    }

    ws.send(JSON.stringify({ type: "flow_select", option_id: optionId }));
    return Promise.resolve();
  }, []);

  const clearChat = useCallback(() => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "clear" }));
    }
    const pending = pendingRef.current;
    if (pending && !pending.settled) {
      pending.reject(new Error("Chat cleared"));
    }
    pendingRef.current = null;
    setStreamingText("");
    setIsResponding(false);
    setFlowExpects(null);
    setDocumentType(null);
    setLlmMode(false);
    documentProcessingRef.current = false;
    setDocumentPipeline(INACTIVE_PIPELINE);
  }, []);

  return {
    connectionStatus,
    streamingText,
    isResponding,
    lastError,
    flowExpects,
    documentType,
    documentPipeline,
    llmMode,
    sendMessage,
    sendDocumentUpload,
    submitExtraction,
    selectFlowOption,
    clearChat,
    isReady: connectionStatus === "connected",
  };
}
