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
    <form onSubmit={handleSubmit} className="relative flex items-end gap-3 p-6 bg-cream">
      <div className="flex-1 bg-white border border-espresso/5 rounded-3xl min-h-[56px] flex items-center px-6 transition-all focus-within:ring-2 ring-crimson/10">
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
          placeholder="Whisper something secret..."
          className="w-full bg-transparent border-none resize-none py-4 text-sm focus:outline-none placeholder:text-espresso/30"
        />
      </div>
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="h-14 w-14 rounded-full bg-crimson text-cream flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale"
      >
        <PaperPlaneTilt size={24} weight="bold" />
      </button>
    </form>
  );
}
