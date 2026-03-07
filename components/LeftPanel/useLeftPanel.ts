"use client";

import type { RootState } from "../../features/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRecentHistory,
  updateSelectedHistory,
} from "../../features/chatBotSlice";
import { useChatPanel } from "../../utils/useChatPanel";
import React from "react";
import type { ChatProps } from "../../features/types";

export const useLeftPanel = ({ scrollToBottom }: ChatProps) => {
  const { recentHistory, selectedHistory } = useSelector((state: RootState) => {
    return {
      recentHistory: state.chatBot.recentHistory,
      selectedHistory: state.chatBot.selectedHistory,
    };
  });

  const { handleSend } = useChatPanel({
    scrollToBottom,
  });

  const dispatch = useDispatch();
  const handleDeleteClick = () => {
    localStorage.clear();
    dispatch(clearRecentHistory());
  };

  const handleHistoryClick = (history: string) => {
    dispatch(updateSelectedHistory(history));
  };

  React.useEffect(() => {
    handleSend();
  }, [selectedHistory]);

  return {
    handleDeleteClick,
    handleHistoryClick,
    recentHistory,
    selectedHistory,
  };
};
