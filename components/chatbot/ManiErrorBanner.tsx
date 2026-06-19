"use client";

export function ManiErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="px-4 pt-4 sm:px-5">
      <div className="flex items-center justify-between gap-3 rounded-[1.3rem] border border-[rgba(157,71,56,0.18)] bg-[linear-gradient(180deg,rgba(255,243,240,0.92),rgba(248,226,219,0.88))] px-4 py-3 text-sm text-stone-800 shadow-[0_10px_28px_rgba(100,57,46,0.1)]">
        <p>{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full bg-[rgba(120,73,60,0.1)] px-3 py-1.5 font-medium text-stone-900 transition hover:bg-[rgba(120,73,60,0.16)]"
        >
          Opnieuw
        </button>
      </div>
    </div>
  );
}
