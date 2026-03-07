import type { ChatBotState } from "./types";

export const initialState: ChatBotState = {
  messages: [],
  loading: false,
  recentHistory: [],
  selectedHistory: "",
};
