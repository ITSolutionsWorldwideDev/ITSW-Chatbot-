export type ManiChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  status: "sent";
};

const ENDPOINT_URL = "/api/chat";
const SESSION_STORAGE_KEY = "mani-chat-session-id";
const MESSAGE_STORAGE_KEY = "mani-chat-messages";

const DEFAULT_MESSAGES: ManiChatMessage[] = [
  {
    id: "mani-welcome-message",
    role: "assistant",
    content:
      "Hi, I'm the IT Solutions Worldwide assistant. Feel free to ask about support, services, systems, or any technical issue.",
    timestamp: new Date().toISOString(),
    status: "sent",
  },
];

function createDefaultMessages() {
  return DEFAULT_MESSAGES.map((message) => ({
    ...message,
    timestamp: new Date().toISOString(),
  }));
}

export function getStoredManiChatSessionId() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_STORAGE_KEY);
}

export function resetStoredManiChatSessionId() {
  if (typeof window === "undefined") return null;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  window.localStorage.removeItem(MESSAGE_STORAGE_KEY);
  return null;
}

export function loadStoredManiMessages(reset = false) {
  if (typeof window === "undefined" || reset) {
    return createDefaultMessages();
  }

  try {
    const stored = window.localStorage.getItem(MESSAGE_STORAGE_KEY);
    if (!stored) return createDefaultMessages();

    const parsed = JSON.parse(stored) as ManiChatMessage[];
    return parsed.length > 0 ? parsed : createDefaultMessages();
  } catch {
    return createDefaultMessages();
  }
}

export function storeManiMessages(messages: ManiChatMessage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
}

export async function sendManiChatMessage(request: {
  message: string;
  conversationId: string | null;
  topic?: string | null;
}) {
  const response = await fetch(ENDPOINT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: request.message,
      sessionId: request.conversationId,
      topic: request.topic ?? null,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  let payload: Record<string, unknown> | null = null;

  try {
    payload = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload?.error as string | undefined) ||
      (payload?.message as string | undefined) ||
      "The chatbot service is not responding correctly right now.";
    throw new Error(message);
  }

  const nextSessionId =
    (payload?.sessionId as string | undefined) ?? request.conversationId;

  if (typeof window !== "undefined" && nextSessionId) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
  }

  return {
    reply: (payload?.reply as string | undefined) ?? (payload?.message as string | undefined) ?? rawText,
    conversationId: nextSessionId,
  };
}
