import { Conversation, Message } from "@/types/chat";

const BASE_URL = "https://whisperbox.koyeb.app";

const getHeaders = () => {
  const token = localStorage.getItem("wb_access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${BASE_URL}/conversations`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  },

  async getMessages(userId: string, limit = 50, before?: string): Promise<Message[]> {
    const url = new URL(`${BASE_URL}/conversations/${userId}/messages`);
    url.searchParams.append("limit", limit.toString());
    if (before) url.searchParams.append("before", before);

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  },

  async searchUsers(query: string): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("User search failed");
    return response.json();
  },

  async getUserPublicKey(userId: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/users/${userId}/public-key`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get public key");
    const data = await response.json();
    return data.public_key;
  },
};
