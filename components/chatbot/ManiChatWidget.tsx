"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ManiChatPanel } from "@/components/chatbot/ManiChatPanel";

export function ManiChatWidget({
  panelClassName,
  launcherClassName,
}: {
  panelClassName?: string;
  launcherClassName?: string;
}) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={false}
        animate={
          isWidgetOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.985 }
        }
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={panelClassName}
      >
        <ManiChatPanel onClose={() => setIsWidgetOpen(false)} />
      </motion.div>

      <motion.div
        className={launcherClassName}
        initial={false}
        animate={{ scale: isWidgetOpen ? 0.96 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={() => setIsWidgetOpen((current) => !current)}
          aria-label={isWidgetOpen ? "Close Mani IT Solutions chat widget" : "Open Mani IT Solutions chat widget"}
          className="group relative rounded-full border border-[rgba(255,255,255,0.54)] bg-[linear-gradient(180deg,rgba(241,248,250,0.92),rgba(203,224,232,0.82))] p-2 shadow-[0_18px_42px_rgba(22,53,67,0.28)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03]"
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_60%)] opacity-80" />
          <span className="absolute -inset-1 rounded-full border border-[rgba(116,191,214,0.3)] opacity-0 blur-sm transition-opacity duration-200 group-hover:opacity-100" />
          <Image
            src="/mani-itsw-chatbot.jpg"
            alt="Mani IT Solutions chatbot logo"
            width={98}
            height={98}
            priority
            className="relative rounded-full object-cover"
          />
        </button>
      </motion.div>
    </>
  );
}
