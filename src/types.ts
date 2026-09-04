export type Role = "user" | "model";

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
