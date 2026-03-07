import type { RefObject } from "react";

// Types for chat feature
export interface MessageObj {
  type: "question" | "answer";
  text: string;
}

export interface ChatBotState {
  messages: Array<MessageObj>;
  loading: boolean;
  recentHistory: string[];
  selectedHistory: string;
}

export interface ChatProps {
  scrollToBottom: RefObject<HTMLDivElement | null>;
}
