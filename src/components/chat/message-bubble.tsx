"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { decryptMessage } from "@/lib/crypto";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";
import { Lock, Fingerprint } from "@phosphor-icons/react";

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  const { privateKey } = useAuth();
  const [decrypted, setDecrypted] = useState<string | null>(message.decryptedContent || null);

  useEffect(() => {
    if (decrypted || !privateKey) return;
    
    const decrypt = async () => {
      try {
        const text = await decryptMessage(message.payload, privateKey, isSelf);
        setDecrypted(text);
      } catch (err) {
        console.error("Decryption failed", err);
        setDecrypted("Error: Could not decrypt message");
      }
    };
    decrypt();
  }, [message, privateKey, isSelf, decrypted]);

  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} space-y-1 group`}>
      <div className={`
        relative max-w-[85%] px-6 py-4 
        ${isSelf 
          ? "bg-espresso text-cream rounded-[2.5rem] rounded-tr-none shadow-lg shadow-espresso/5" 
          : "bg-white text-espresso border border-espresso/5 rounded-[2.5rem] rounded-tl-none shadow-sm"}
      `}>
        {!decrypted ? (
          <div className="flex items-center gap-3 opacity-30 italic text-sm">
            <div className="animate-pulse"><Lock size={16} weight="fill" /></div>
            <span className="font-bold tracking-widest uppercase text-[10px]">Decoding...</span>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{decrypted}</p>
        )}
      </div>
      <div className={`flex items-center gap-2 px-4 transition-all duration-500 ${decrypted ? "opacity-100" : "opacity-0"}`}>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-espresso/20">
          {format(new Date(message.created_at), "HH:mm")}
        </span>
        <Fingerprint size={12} weight="bold" className={isSelf ? "text-crimson/30" : "text-forest/30"} />
      </div>
    </div>
  );
}
