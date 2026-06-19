"use client";

import { useEffect, useRef } from "react";
import { type ManiChatMessage } from "@/lib/maniClient";
import { ManiRichText } from "@/components/chatbot/ManiRichText";

export function ManiMessageList({ messages }: { messages: ManiChatMessage[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
    >
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";

        return (
          <article
            key={message.id}
            className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[84%] rounded-[1.6rem] border px-4 py-3 shadow-[0_12px_34px_rgba(31,56,67,0.08)] backdrop-blur-xl sm:max-w-[74%] ${
                isAssistant
                  ? "border-[rgba(255,255,255,0.42)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(228,240,244,0.62))] text-slate-800"
                  : "border-[rgba(56,112,129,0.28)] bg-[linear-gradient(180deg,rgba(77,142,162,0.94),rgba(46,97,115,0.92))] text-white"
              }`}
            >
              <ManiRichText content={message.content} tone={isAssistant ? "assistant" : "user"} />
              <p
                className={`mt-2 text-[0.7rem] font-medium ${
                  isAssistant ? "text-slate-500" : "text-cyan-50/84"
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
