import { EncryptedPayload } from "@/lib/crypto";

export interface Conversation {
  user_id: string;
  username: string;
  display_name: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  payload: EncryptedPayload;
  delivered: boolean;
  created_at: string;
  // Local only
  decryptedContent?: string;
  isSending?: boolean;
  error?: string;
}

export type WSEvent = 
  | { event: "message.receive"; id: string; from_user_id: string; to_user_id: string; payload: EncryptedPayload; created_at: string }
  | { event: "user.online"; user_id: string }
  | { event: "user.offline"; user_id: string }
  | { event: "error"; detail: string };

export type WSOutgoingEvent = 
  | { event: "message.send"; to: string; payload: EncryptedPayload };
