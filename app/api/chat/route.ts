import { NextRequest, NextResponse } from "next/server";

type UnknownRecord = Record<string, unknown>;

function getWebhookUrl() {
  return (
    process.env.MANI_N8N_WEBHOOK_URL ||
    process.env.Mani_N8N_WEBHOOK_URL ||
    process.env.N8N_CHAT_WEBHOOK_URL ||
    process.env.BIBI_N8N_WEBHOOK_URL ||
    ""
  ).trim();
}

function getTimeoutMs() {
  const raw =
    process.env.MANI_N8N_TIMEOUT_MS ||
    process.env.Mani_N8N_TIMEOUT_MS ||
    process.env.BIBI_N8N_TIMEOUT_MS ||
    process.env.N8N_CHAT_TIMEOUT_MS ||
    "25000";
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 25000;
}

function extractReply(payload: unknown): string | null {
  if (typeof payload === "string") {
    return payload.trim() || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const reply = extractReply(item);
      if (reply) return reply;
    }
    return null;
  }

  if (payload && typeof payload === "object") {
    const record = payload as UnknownRecord;
    const preferredKeys = [
      "reply",
      "response",
      "message",
      "text",
      "output",
      "content",
      "answer",
    ];

    for (const key of preferredKeys) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    if (record.data) {
      const nested = extractReply(record.data);
      if (nested) return nested;
    }

    for (const value of Object.values(record)) {
      const nested = extractReply(value);
      if (nested) return nested;
    }
  }

  return null;
}

function extractSessionId(payload: unknown, fallback: string | null): string | null {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as UnknownRecord;
    const candidates = [
      record.sessionId,
      record.conversationId,
      record.chatId,
      record.id,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }

    if (record.data && typeof record.data === "object" && record.data !== null) {
      return extractSessionId(record.data, fallback);
    }
  }

  return fallback;
}

export async function POST(request: NextRequest) {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    return NextResponse.json(
      {
        error:
          "Missing n8n webhook URL. Set MANI_N8N_WEBHOOK_URL, N8N_CHAT_WEBHOOK_URL, or BIBI_N8N_WEBHOOK_URL.",
      },
      { status: 500 },
    );
  }

  let body: { message?: unknown; sessionId?: unknown; topic?: unknown } = {};

  try {
    body = (await request.json()) as { message?: unknown; sessionId?: unknown; topic?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        topic,
        sessionId,
        source: "itsw-frontend-chatbot",
        timestamp: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const rawText = await upstreamResponse.text();
    let payload: unknown = rawText;

    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = rawText;
    }

    if (!upstreamResponse.ok) {
      const errorMessage =
        extractReply(payload) ||
        `n8n webhook returned status ${upstreamResponse.status}.`;

      return NextResponse.json({ error: errorMessage }, { status: upstreamResponse.status });
    }

    const reply =
      extractReply(payload) ||
      "Your message was received, but the automation did not return a reply.";

    return NextResponse.json({
      reply,
      sessionId: extractSessionId(payload, sessionId),
      raw: payload,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The n8n webhook timed out."
        : error instanceof Error
          ? error.message
          : "Failed to connect to the n8n webhook.";

    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
