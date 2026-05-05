"use client";

import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { decryptMessage } from "@/lib/crypto";
import { useAuth } from "@/context/auth-context";
import { format } from "date-fns";
import { Lock, LockOpen } from "@phosphor-icons/react";

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
        relative max-w-[85%] px-5 py-3 
        ${isSelf 
          ? "bg-espresso text-cream rounded-2xl rounded-tr-none" 
          : "bg-white text-espresso border border-espresso/5 rounded-2xl rounded-tl-none shadow-sm"}
      `}>
        {!decrypted ? (
          <div className="flex items-center gap-2 opacity-40 italic text-sm">
            <Lock size={14} />
            <span>Decrypting...</span>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{decrypted}</p>
        )}
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="text-[9px] font-bold uppercase tracking-widest text-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity">
          {format(new Date(message.created_at), "HH:mm")}
        </span>
        {decrypted && <LockOpen size={10} className="text-forest/40" />}
      </div>
    </div>
  );
}
