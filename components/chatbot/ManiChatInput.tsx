"use client";

import type { KeyboardEvent } from "react";

export function ManiChatInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="border-t border-[rgba(255,255,255,0.24)] bg-[linear-gradient(180deg,rgba(241,248,250,0.78),rgba(225,238,243,0.66))] p-4 sm:p-5">
      <div className="rounded-[1.75rem] border border-[rgba(255,255,255,0.42)] bg-[rgba(255,255,255,0.5)] p-2 shadow-[0_18px_38px_rgba(31,56,67,0.08)] backdrop-blur-xl">
        <div className="flex items-end gap-3">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Typ je vraag aan Mani IT Solutions..."
            rows={1}
            className="max-h-40 min-h-[56px] flex-1 resize-none bg-transparent px-4 py-3 text-[0.95rem] text-slate-800 outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(65,136,156,1),rgba(34,92,109,1))] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(22,53,67,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isLoading ? "Bezig..." : "Verstuur"}
          </button>
        </div>
      </div>
    </div>
  );
}
