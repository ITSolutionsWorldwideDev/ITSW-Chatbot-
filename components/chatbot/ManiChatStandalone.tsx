"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { ManiChatWidget } from "@/components/chatbot/ManiChatWidget";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export function ManiChatStandalone() {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(244,250,252,0.96),rgba(223,236,242,0.88)_40%,rgba(182,204,214,0.78)_72%,rgba(119,147,160,0.82)_100%)] text-slate-900 ${plusJakartaSans.className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.38),rgba(255,255,255,0.08))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(117,201,223,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(33,88,108,0.18),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(94,76,57,0.12),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-[2rem] border border-[rgba(255,255,255,0.42)] bg-[rgba(238,246,249,0.24)] p-4 shadow-[0_24px_80px_rgba(24,48,59,0.18)] backdrop-blur-xl sm:p-6">
          <div className="relative min-h-[760px] overflow-hidden rounded-[1.8rem] border border-[rgba(255,255,255,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(207,227,235,0.12))]">
            <ManiChatWidget
              panelClassName="absolute inset-0 z-20"
              launcherClassName="absolute bottom-6 right-6 z-30"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
