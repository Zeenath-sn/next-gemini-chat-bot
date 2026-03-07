import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MessageObj } from "./types";
import { initialState } from "./chatBotInitialState";

export const chatBotSlice = createSlice({
  name: "chatBot",
  initialState,
  reducers: {
    updateMessages: (state, action: PayloadAction<MessageObj>) => {
      const payload = action.payload;
      state.messages = [
        ...state.messages,
        {
          type: payload?.type,
          text: payload?.text,
        },
      ];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateRecentHistory: (state, action: PayloadAction<string[]>) => {
      state.recentHistory = action.payload;
    },
    clearRecentHistory: (state) => {
      state.recentHistory = [];
    },
    updateSelectedHistory: (state, action: PayloadAction<string>) => {
      state.selectedHistory = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateMessages,
  setLoading,
  updateRecentHistory,
  clearRecentHistory,
  updateSelectedHistory,
} = chatBotSlice.actions;

export default chatBotSlice.reducer;
