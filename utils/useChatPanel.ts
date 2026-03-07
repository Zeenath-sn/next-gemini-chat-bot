import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  updateMessages,
  updateRecentHistory,
} from "../features/chatBotSlice";
import type { RootState } from "../features/store";
import type { ChatProps } from "../features/types";

export const useChatPanel = (props: ChatProps) => {
  const { scrollToBottom } = props;
  const [input, setInput] = useState("");

  const { messages, loading, selectedHistory } = useSelector(
    (state: RootState) => {
      return {
        messages: state.chatBot.messages,
        loading: state.chatBot.loading,
        selectedHistory: state.chatBot.selectedHistory,
      };
    },
  );
  const dispatch = useDispatch();

  // Helper: read/write recent history in localStorage
  const loadHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("history") || "[]");
    } catch (err) {
      console.warn("Failed to parse history from localStorage", err);
      return [];
    }
  }, []);

  const saveHistory = useCallback(
    (value: string) => {
      const history = [value, ...loadHistory()].slice(0, 50); // keep a reasonable cap
      localStorage.setItem("history", JSON.stringify(history));
      dispatch(updateRecentHistory(history));
    },
    [dispatch, loadHistory],
  );

  // Load recent history once on mount
  useEffect(() => {
    dispatch(updateRecentHistory(loadHistory()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (message: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply;
  };

  // Generate content from the model for a single question string
  const generateContent = useCallback(
    async (text: string) => {
      try {
        const modelResult = await sendMessage(text);
        if (modelResult?.error) {
          updateMessages({
            type: "answer",
            text: "Error: " + modelResult.error.message,
          });
          return;
        }
        dispatch(updateMessages({ type: "answer", text: modelResult }));
      } catch (err) {
        console.error("Error generating content:", err);
        updateMessages({
          type: "answer",
          text: "Error: " + (err instanceof Error ? err.message : String(err)),
        });
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleSend = useCallback(async () => {
    // Determine the question text: either input field or a selected history item
    const text = input?.trim() || selectedHistory;
    if (!text) return false;

    // Save question to history if it came from the input
    if (input) saveHistory(input);

    // Update local question state and push a question message to the store
    dispatch(updateMessages({ type: "question", text }));
    // Trigger generation
    dispatch(setLoading(true));
    setInput("");
    await generateContent(text);

    // Reset input field
    // keep scrollToBottom available to callers/components
    // if (typeof scrollToBottom === "function") scrollToBottom();

    return true;
  }, [input, selectedHistory, saveHistory, dispatch, generateContent]);

  return {
    input,
    handleInputChange,
    handleSend,
    messages,
    loading,
    scrollToBottom,
  };
};
