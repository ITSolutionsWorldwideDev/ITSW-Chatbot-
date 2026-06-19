"use client";

import Image from "next/image";

export function ManiChatHeader({
  onClose,
  onClear,
}: {
  onClose: () => void;
  onClear: () => void;
}) {
  return (
    <header className="relative flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.26)] bg-[linear-gradient(180deg,rgba(35,76,92,0.92),rgba(53,103,120,0.88))] px-5 py-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_56%)]" />
      <div className="relative flex min-w-0 items-center gap-3">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.1)] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
          <Image
            src="/mani-itsw-chatbot.jpg"
            alt="Mani IT Solutions chatbot logo"
            width={52}
            height={52}
            className="rounded-[1rem] object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-cyan-100/88">
            Mani IT Solutions
          </p>
          <h2 className="truncate text-lg font-semibold">Digital Assistant</h2>
          <p className="truncate text-sm text-slate-100/78">
            Slimme hulp voor support, services en vragen
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-3 py-2 text-sm font-medium text-white/92 transition hover:bg-[rgba(255,255,255,0.16)]"
        >
          Nieuw gesprek
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] text-sm font-semibold text-white/92 transition hover:bg-[rgba(255,255,255,0.16)]"
        >
          X
        </button>
      </div>
    </header>
  );
}
