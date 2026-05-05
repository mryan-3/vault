"use client";

import { useEffect, useState, useRef } from "react";
import { Message, Conversation } from "@/types/chat";
import { chatService } from "@/services/chat";
import { encryptMessage, importPublicKey } from "@/lib/crypto";
import { useAuth } from "@/context/auth-context";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { ShieldCheck, User as UserIcon } from "@phosphor-icons/react";

interface ChatWindowProps {
  recipientId: string | null;
  onNewMessage: (msg: Message) => void;
  incomingMessage: Message | null;
  onSend: (event: any) => void;
}

export function ChatWindow({ recipientId, onNewMessage, incomingMessage, onSend }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, privateKey } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle real-time incoming messages from the parent
  useEffect(() => {
    if (incomingMessage && (incomingMessage.from_user_id === recipientId || incomingMessage.to_user_id === recipientId)) {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === incomingMessage.id)) return prev;
        return [incomingMessage, ...prev];
      });
    }
  }, [incomingMessage, recipientId]);

  useEffect(() => {
    if (!recipientId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [history, pubKey] = await Promise.all([
          chatService.getMessages(recipientId),
          chatService.getUserPublicKey(recipientId)
        ]);
        setMessages(history);
        setRecipient({ id: recipientId, publicKey: await importPublicKey(pubKey) });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recipientId]);

  const handleSend = async (text: string) => {
    if (!recipient || !user || !privateKey) return;
    const myPubKey = await importPublicKey(user.public_key);
    const payload = await encryptMessage(text, recipient.publicKey, myPubKey);
    
    // Optimistic Update: Add to local state immediately
    const tempId = Math.random().toString(36).substring(7);
    const newMessage: Message = {
      id: tempId,
      from_user_id: user.id,
      to_user_id: recipient.id,
      payload,
      delivered: true,
      created_at: new Date().toISOString(),
      decryptedContent: text // Pre-decrypt for ourselves
    };

    setMessages((prev) => [newMessage, ...prev]);
    onSend({ event: "message.send", to: recipient.id, payload });
    onNewMessage(newMessage);
  };

  if (!recipientId) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#fbfaf3] p-12 text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-espresso/5 flex items-center justify-center text-espresso/20">
        <ShieldCheck size={40} weight="duotone" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Select a conversation</h2>
      <p className="max-w-xs text-sm text-espresso/40">Your messages are secured with end-to-end encryption. Only you and the recipient can read them.</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fbfaf3]">
      <header className="h-20 border-b border-espresso/5 px-8 flex items-center justify-between bg-cream/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-espresso/5 flex items-center justify-center text-espresso/40">
            <UserIcon size={20} weight="bold" />
          </div>
          <div>
            <p className="font-bold tracking-tight">Active Session</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-forest" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest">E2EE Secured</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col-reverse gap-6 no-scrollbar" ref={scrollRef}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isSelf={m.from_user_id === user?.id} />
        ))}
        {loading && <div className="text-center text-xs font-bold uppercase tracking-widest text-espresso/20 animate-pulse">Synchronizing...</div>}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
