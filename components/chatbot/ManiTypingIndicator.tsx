"use client";

export function ManiTypingIndicator({
  phase,
}: {
  phase: "sending" | "thinking";
}) {
  return (
    <div className="px-4 pb-2 sm:px-5">
      <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(255,255,255,0.34)] bg-[rgba(255,255,255,0.42)] px-4 py-2 text-sm text-slate-700 shadow-[0_10px_26px_rgba(31,56,67,0.08)] backdrop-blur-xl">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.24s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.12s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-teal-600" />
        </span>
        <span>{phase === "sending" ? "Bericht wordt verzonden..." : "Assistant denkt mee..."}</span>
      </div>
    </div>
  );
}
