"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { chatService } from "@/services/chat";
import { useWebSocket } from "@/hooks/use-web-socket";
import { Conversation, Message } from "@/types/chat";
import AuthGuard from "@/components/auth-guard";

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  }, []);

  const { send } = useWebSocket(useCallback((event) => {
    if (event.event === "message.receive") {
      setIncomingMessage(event as unknown as Message);
      loadConversations();
    }
  }, [loadConversations]));

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleNewMessage = () => {
    loadConversations();
  };

  const handleNewChat = (user: any) => {
    setSelectedChatId(user.id);
    if (!conversations.find(c => c.user_id === user.id)) {
      setConversations(prev => [{
        user_id: user.id,
        username: user.username,
        display_name: user.display_name,
        last_message_at: new Date().toISOString()
      }, ...prev]);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-cream font-sans selection:bg-crimson/10 selection:text-crimson">
        <Sidebar 
          conversations={conversations} 
          selectedChatId={selectedChatId || undefined} 
          onSelectChat={setSelectedChatId}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 overflow-hidden">
          <ChatWindow 
            recipientId={selectedChatId} 
            onNewMessage={handleNewMessage}
            incomingMessage={incomingMessage}
            onSend={send}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
