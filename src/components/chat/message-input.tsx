"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

interface MessageInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-4 p-8 bg-[#fbfaf3]">
      <div className="flex-1 bg-white border-b-2 border-espresso/5 min-h-[64px] flex items-center px-8 transition-all focus-within:border-crimson/40">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type a confidential message..."
          className="w-full bg-transparent border-none resize-none py-5 text-[15px] font-medium focus:outline-none placeholder:text-espresso/20"
        />
      </div>
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="h-14 w-14 rounded-full bg-crimson text-cream flex items-center justify-center shadow-xl shadow-crimson/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale"
      >
        <PaperPlaneTilt size={26} weight="fill" />
      </button>
    </form>
  );
}
