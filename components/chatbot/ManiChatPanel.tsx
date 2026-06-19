"use client";

import { useEffect, useRef, useState } from "react";
import { ManiChatHeader } from "@/components/chatbot/ManiChatHeader";
import { ManiChatInput } from "@/components/chatbot/ManiChatInput";
import { ManiErrorBanner } from "@/components/chatbot/ManiErrorBanner";
import { ManiMessageList } from "@/components/chatbot/ManiMessageList";
import { ManiTypingIndicator } from "@/components/chatbot/ManiTypingIndicator";
import {
  getStoredManiChatSessionId,
  loadStoredManiMessages,
  resetStoredManiChatSessionId,
  sendManiChatMessage,
  storeManiMessages,
  type ManiChatMessage,
} from "@/lib/maniClient";

export function ManiChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ManiChatMessage[]>(() => loadStoredManiMessages());
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    () => getStoredManiChatSessionId(),
  );
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestPhase, setRequestPhase] = useState<"idle" | "sending" | "thinking">("idle");
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    storeManiMessages(messages);
  }, [messages]);

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }
    };
  }, []);

  async function submitMessage(messageText?: string) {
    const content = (messageText ?? input).trim();
    if (!content || requestPhase !== "idle") return;

    const userMessage: ManiChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setLastSubmittedMessage(content);
    setRequestPhase("sending");

    phaseTimerRef.current = setTimeout(() => {
      setRequestPhase("thinking");
    }, 450);

    try {
      const result = await sendManiChatMessage({ message: content, conversationId });

      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }

      setConversationId(result.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.reply,
          timestamp: new Date().toISOString(),
          status: "sent",
        },
      ]);
    } catch (submissionError) {
      if (phaseTimerRef.current) {
        clearTimeout(phaseTimerRef.current);
      }

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to reach the Mani IT Solutions backend.",
      );
    } finally {
      setRequestPhase("idle");
    }
  }

  function clearConversation() {
    setMessages(loadStoredManiMessages(true));
    setConversationId(resetStoredManiChatSessionId());
    setError(null);
    setInput("");
    setLastSubmittedMessage(null);
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.24)] bg-[linear-gradient(180deg,rgba(228,240,245,0.84),rgba(204,224,232,0.58))] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-2xl">
      <ManiChatHeader onClose={onClose} onClear={clearConversation} />
      {error ? (
        <ManiErrorBanner
          message={error}
          onRetry={() => {
            if (lastSubmittedMessage) {
              void submitMessage(lastSubmittedMessage);
            }
          }}
        />
      ) : null}
      <ManiMessageList messages={messages} />
      {requestPhase !== "idle" ? <ManiTypingIndicator phase={requestPhase} /> : null}
      <ManiChatInput
        value={input}
        isLoading={requestPhase !== "idle"}
        onChange={setInput}
        onSubmit={() => void submitMessage()}
      />
    </section>
  );
}
