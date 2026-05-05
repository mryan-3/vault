"use client";

import { useAuth } from "@/context/auth-context";
import { UserSearch } from "./user-search";
import { ConversationList } from "./conversation-list";
import { Conversation } from "@/types/chat";
import { SignOut } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  conversations: Conversation[];
  selectedChatId?: string;
  onSelectChat: (id: string) => void;
  onNewChat: (user: any) => void;
}

export function Sidebar({ conversations, selectedChatId, onSelectChat, onNewChat }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full h-full border-r border-espresso/5 bg-cream p-6 flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3 text-crimson">
          <Logo size={32} />
          <span className="text-xl font-bold tracking-tighter uppercase">Vault</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        <UserSearch onSelectUser={onNewChat} />
        <ConversationList 
          conversations={conversations} 
          selectedId={selectedChatId} 
          onSelect={onSelectChat} 
        />
      </div>

      <footer className="mt-auto pt-6 border-t border-espresso/5">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-crimson text-cream flex items-center justify-center font-black text-xs">
              {user?.display_name[0]}
            </div>
            <div>
              <p className="font-bold text-xs tracking-tight text-espresso">{user?.display_name}</p>
              <p className="text-[10px] font-medium text-espresso/30 lowercase">Vault Member</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="p-2 text-espresso/20 hover:text-crimson transition-colors"
            title="Secure Logout"
          >
            <SignOut size={18} weight="bold" />
          </button>
        </div>
      </footer>
    </aside>
  );
}
