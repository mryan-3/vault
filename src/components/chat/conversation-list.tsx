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
    <div className="space-y-1 mt-6">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-espresso/30 px-3 mb-3">
        Conversations
      </h2>
      {conversations.length === 0 ? (
        <p className="px-3 text-sm text-espresso/40 italic">No messages yet...</p>
      ) : (
        conversations.map((c) => (
          <button
            key={c.user_id}
            onClick={() => onSelect(c.user_id)}
            className={cn(
              "flex w-full items-center justify-between p-3 rounded-2xl transition-all",
              selectedId === c.user_id 
                ? "bg-white shadow-sm ring-1 ring-espresso/5" 
                : "hover:bg-espresso/5"
            )}
          >
            <div className="text-left">
              <p className="font-bold tracking-tight text-espresso">{c.display_name}</p>
              <p className="text-[10px] font-medium text-espresso/40">
                {formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })}
              </p>
            </div>
            {selectedId === c.user_id && <div className="h-1.5 w-1.5 rounded-full bg-crimson" />}
          </button>
        ))
      )}
    </div>
  );
}
