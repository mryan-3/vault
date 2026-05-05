"use client";

import { useState, useEffect } from "react";
import { chatService } from "@/services/chat";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, UserPlus } from "@phosphor-icons/react";

interface UserSearchProps {
  onSelectUser: (user: any) => void;
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const users = await chatService.searchUsers(query);
        setResults(users);
      } catch (err) {
        console.error("Search error", err);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlass className="absolute left-0 top-1/2 -translate-y-1/2 text-espresso/40" size={18} />
        <Input 
          placeholder="Search for users..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 border-b-espresso/5"
        />
      </div>
      
      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => { onSelectUser(u); setQuery(""); }}
              className="flex w-full items-center justify-between p-3 rounded-xl hover:bg-espresso/5 transition-colors group"
            >
              <div className="text-left">
                <p className="font-bold tracking-tight">{u.display_name}</p>
                <p className="text-xs text-espresso/40">@{u.username}</p>
              </div>
              <UserPlus size={20} className="text-crimson opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
