"use client";

import { Conversation } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/components/ui/input";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="space-y-2 mt-8">
      <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso/20 px-1 mb-4">
        Archived Chats
      </h2>
      {conversations.length === 0 ? (
        <p className="px-1 text-sm text-espresso/30 italic">No whispers found.</p>
      ) : (
        conversations.map((c) => (
          <button
            key={c.user_id}
            onClick={() => onSelect(c.user_id)}
            className={cn(
              "relative flex w-full items-start gap-4 p-3 transition-all group",
              selectedId === c.user_id 
                ? "bg-espresso/5 rounded-2xl" 
                : "hover:bg-espresso/[0.02] rounded-2xl"
            )}
          >
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <p className={cn(
                  "font-bold tracking-tight text-espresso transition-colors",
                  selectedId === c.user_id ? "text-crimson" : "group-hover:text-espresso"
                )}>
                  {c.display_name}
                </p>
                <span className="text-[9px] font-black text-espresso/20">
                  {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: false })}
                </span>
              </div>
              <p className="text-[10px] font-medium text-espresso/40 truncate pr-4 uppercase tracking-widest">
                Active Session
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
