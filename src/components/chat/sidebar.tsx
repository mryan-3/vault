"use client";

import { useAuth } from "@/context/auth-context";
import { UserSearch } from "./user-search";
import { ConversationList } from "./conversation-list";
import { Conversation } from "@/types/chat";
import { SignOut, ShieldCheck } from "@phosphor-icons/react";

interface SidebarProps {
  conversations: Conversation[];
  selectedChatId?: string;
  onSelectChat: (id: string) => void;
  onNewChat: (user: any) => void;
}

export function Sidebar({ conversations, selectedChatId, onSelectChat, onNewChat }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-80 h-full border-r border-espresso/5 bg-cream p-6 flex flex-col">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2 text-crimson">
          <ShieldCheck size={28} weight="fill" />
          <span className="text-lg font-bold tracking-tighter uppercase">Vault</span>
        </div>
        <button onClick={logout} className="p-2 hover:bg-crimson/5 rounded-full text-crimson transition-colors">
          <SignOut size={20} weight="bold" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        <UserSearch onSelectUser={onNewChat} />
        <ConversationList 
          conversations={conversations} 
          selectedId={selectedChatId} 
          onSelect={onSelectChat} 
        />
      </div>

      <footer className="pt-6 border-t border-espresso/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-crimson/10 flex items-center justify-center text-crimson font-bold">
            {user?.display_name[0]}
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight">{user?.display_name}</p>
            <p className="text-[10px] font-medium text-espresso/40 lowercase">@{user?.username}</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
