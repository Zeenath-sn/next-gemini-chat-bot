"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { MessageObj } from "../../features/types";
import React from "react";

interface TypingMarkdownProps {
  message: MessageObj;
  scrollToBottom: React.RefObject<HTMLDivElement | null>;
}

export const TypingMarkdown = ({
  message,
  scrollToBottom,
}: TypingMarkdownProps) => {
  const [displayResponse, setDisplayResponse] = useState("");
  useEffect(() => {
    const strResp = message.text;
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayResponse(strResp.slice(0, i));
      i += 1;
      scrollToBottom.current &&
        scrollToBottom.current.scrollTo({
          top: scrollToBottom.current.scrollHeight,
          behavior: "smooth",
        });
      if (i > strResp.length) {
        clearInterval(intervalId);
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [message]);
  return <ReactMarkdown>{displayResponse}</ReactMarkdown>;
};
