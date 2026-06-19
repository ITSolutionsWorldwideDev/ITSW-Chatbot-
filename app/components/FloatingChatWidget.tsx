"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ManiRichText } from "@/components/chatbot/ManiRichText";
import {
  getStoredManiChatSessionId,
  loadStoredManiMessages,
  resetStoredManiChatSessionId,
  sendManiChatMessage,
  storeManiMessages,
  type ManiChatMessage,
} from "@/lib/maniClient";

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

const directServices = [
  {
    title: "Business Transformation",
    icon: <WorkflowIcon />,
    items: ["SCM Services", "IT Support", "Smart Warehouse Solutions"],
  },
  {
    title: "Digital Services",
    icon: <CodeWindowIcon />,
    items: [
      "Website Design & Development",
      "Ecommerce Development",
      "SEO Services",
      "PPC Advertising",
      "Social Media Marketing",
      "IT Support",
      "Software Development",
    ],
  },
  {
    title: "Staffing Support",
    icon: <TeamIcon />,
    items: [
      "Temporary Staffing",
      "Managed Staffing Services",
      "Remote & Virtual Staffing",
      "Specialized Industry Staffing",
      "Staffing Consulting Services",
    ],
  },
  {
    title: "Outsourcing",
    icon: <OutsourceIcon />,
    items: [
      "Hire Roles",
      "Business Support",
      "Design Services",
      "IT & Development",
      "Marketing & Analytics",
    ],
  },
];

const quickSuggestions = ["About Us", "Contact Us"];

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ManiChatMessage[]>(() => loadStoredManiMessages());
  const [conversationId, setConversationId] = useState<string | null>(
    () => getStoredManiChatSessionId(),
  );
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    storeManiMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, isSending, messages]);

  const hasConversationStarted = messages.some((message) => message.role === "user");

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ManiChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const result = await sendManiChatMessage({
        message: trimmed,
        conversationId,
        topic: selectedTopic,
      });

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
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The chatbot service is not responding correctly right now.",
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleReset() {
    setMessages(loadStoredManiMessages(true));
    setConversationId(resetStoredManiChatSessionId());
    setInput("");
    setError(null);
    setExpandedService(null);
    setSelectedTopic(null);
  }

  function setPrompt(prompt: string) {
    setInput(prompt);
  }

  function toggleService(title: string) {
    setSelectedTopic(title);
    setExpandedService((current) => (current === title ? null : title));
  }

  function openChat() {
    setIsOpen(true);
  }

  return (
    <div className="floating-chat">
      {isOpen ? (
        <section className="floating-chat__panel" aria-label="Chatbot widget">
          <header className="floating-chat__panel-header">
            <div className="floating-chat__panel-logo">
              <Image
                src="/itsw-transparent.png"
                alt="IT Solutions Worldwide logo"
                width={460}
                height={120}
                className="floating-chat__panel-brand-image"
              />
            </div>

            <button
              type="button"
              className="floating-chat__header-icon"
              aria-label="Clear chat"
              onClick={handleReset}
            >
              Clear chat
            </button>
          </header>

          <div className="floating-chat__messages" ref={scrollRef}>
            <div className="floating-chat__welcome">
              <section className="floating-chat__welcome-card">
                <div className="floating-chat__welcome-hero">
                  <div className="floating-chat__welcome-avatar">
                    <div className="floating-chat__welcome-avatar-ring">
                      <Image
                        src="/mani-itsw-chatbot.png"
                        alt="Mani, IT Solutions Worldwide assistant"
                        width={112}
                        height={112}
                        className="floating-chat__welcome-avatar-image"
                      />
                    </div>
                    <span className="floating-chat__welcome-status" aria-hidden="true" />
                  </div>

                  <div className="floating-chat__welcome-copy">
                    <h2>Hi, I&apos;m Mani</h2>
                    <p>
                      Hi, I&apos;m Mani from <strong>IT Solutions Worldwide</strong>. How can I
                      help you today?
                    </p>
                  </div>
                </div>

                <div className="floating-chat__welcome-services">
                  <p className="floating-chat__welcome-label">Direct Services</p>

                  <div className="floating-chat__welcome-service-list">
                    {directServices.map((service) => (
                      <div
                        key={service.title}
                        className={`floating-chat__welcome-service-group${
                          expandedService === service.title
                            ? " floating-chat__welcome-service-group--open"
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="floating-chat__welcome-service"
                          onClick={() => toggleService(service.title)}
                        >
                          <span className="floating-chat__welcome-service-icon" aria-hidden="true">
                            {service.icon}
                          </span>
                          <span className="floating-chat__welcome-service-title">{service.title}</span>
                          <span className="floating-chat__welcome-service-arrow" aria-hidden="true">
                            <ChevronRightIcon />
                          </span>
                        </button>

                        {expandedService === service.title ? (
                          <div className="floating-chat__welcome-subservice-list">
                            {service.items.map((item) => (
                              <button
                                  key={item}
                                  type="button"
                                  className="floating-chat__welcome-subservice"
                                  onClick={() => {
                                    setSelectedTopic(service.title);
                                    setPrompt(`I want to learn more about ${item}.`);
                                  }}
                                >
                                <span>{item}</span>
                                <span
                                  className="floating-chat__welcome-subservice-arrow"
                                  aria-hidden="true"
                                >
                                  <ChevronRightIcon />
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="floating-chat__welcome-chips">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="floating-chat__welcome-chip"
                      onClick={() =>
                        {
                          setSelectedTopic(suggestion);
                          setPrompt(
                            suggestion === "About Us"
                              ? "Tell me more about IT Solutions Worldwide."
                              : "I want to get in touch with your team.",
                          );
                        }
                      }
                    >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {hasConversationStarted ? (
              <>
                {messages.map((message) =>
                  message.role === "assistant" ? (
                    <div className="floating-chat__row floating-chat__row--assistant" key={message.id}>
                      <Image
                        src="/mani-itsw-chatbot.png"
                        alt="Mani IT Solutions"
                        width={72}
                        height={72}
                        className="floating-chat__message-logo"
                      />
                      <div className="floating-chat__message-group">
                        <p className="floating-chat__message-label">IT SOLUTIONS WORLDWIDE</p>
                        <article className="floating-chat__bubble floating-chat__bubble--assistant">
                          <ManiRichText content={message.content} tone="assistant" />
                        </article>
                        <span className="floating-chat__time">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="floating-chat__row floating-chat__row--user" key={message.id}>
                      <div className="floating-chat__message-group floating-chat__message-group--user">
                        <article className="floating-chat__bubble floating-chat__bubble--user">
                          <ManiRichText content={message.content} tone="user" />
                        </article>
                        <span className="floating-chat__time floating-chat__time--user">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ),
                )}

                {isSending ? (
                  <div className="floating-chat__row floating-chat__row--assistant">
                    <div className="floating-chat__message-logo floating-chat__message-logo--animated">
                      <video
                        src="/mani-chatbot-loop-animation.mov"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="floating-chat__message-video"
                      />
                    </div>
                    <div className="floating-chat__message-group">
                      <p className="floating-chat__message-label">IT SOLUTIONS WORLDWIDE</p>
                      <div className="floating-chat__bubble floating-chat__bubble--assistant floating-chat__bubble--typing">
                        <span className="floating-chat__typing-dots" aria-label="Mani is typing">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          {error ? <p className="floating-chat__error">{error}</p> : null}

          <div className="floating-chat__composer-shell">
            <textarea
              value={input}
              rows={1}
              placeholder="Ask your question or choose a service above..."
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
            />
            <button
              type="button"
              className="floating-chat__send"
              onClick={() => void handleSubmit()}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              <SendArrowIcon />
            </button>
          </div>
        </section>
      ) : null}

      <div className={`floating-chat__dock${isOpen ? " floating-chat__dock--open" : ""}`}>
        {!isOpen ? (
          <button
            type="button"
            className="floating-chat__teaser"
            onClick={openChat}
            aria-label="Open chatbot"
          >
            Hi! Mani here, ready to assist.
          </button>
        ) : null}

        <button
          type="button"
          className="floating-chat__launcher"
          aria-label={isOpen ? "Close chatbot widget" : "Open chatbot widget"}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              openChat();
            }
          }}
        >
          <Image
            src="/mani-itsw-chatbot.png"
            alt="Mani IT Solutions chatbot"
            width={132}
            height={132}
            className="floating-chat__launcher-image"
          />
        </button>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkGridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h4v4H7zM13 13h4v4h-4zM13 5h4v4h-4zM7 15h4v4H7z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M11 7h2M12 9v4M11 17h2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h4v4H7zM13 13h4v4h-4zM13 5h4v4h-4zM7 15h4v4H7z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M11 7h2M12 9v4M11 17h2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CodeWindowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m10 10-2 2 2 2M14 10l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 19a5 5 0 0 1 10 0M14 19a4 4 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OutsourceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7h8M8 12h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m14 15 3 3 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 13v4a2 2 0 0 0 2 2h1v-7H8a2 2 0 0 0-2 2Zm12 0v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2ZM7 12a5 5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 19v1a2 2 0 0 1-2 2h-1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v5c0 5 3.4 8.7 7 10 3.6-1.3 7-5 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 18a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17 8.5h.2A3.8 3.8 0 1 1 17.5 18H7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9.5 13.5 2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
