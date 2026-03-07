"use client";

import { useChatPanel } from "@/utils/useChatPanel";
import React from "react";
import { TypingMarkdown } from "../TypingMarkdown/TypingMarkdown";
import ChatFooter from "../ChatFooter/ChatFooter";

export default function ChatMessages() {
  const scrollToBottom = React.useRef<HTMLDivElement>(null);
  const { messages, loading } = useChatPanel({ scrollToBottom });

  return (
    <>
      <section
        ref={scrollToBottom}
        className="m-7.5 h-(--my-height) overflow-auto text-xl flex flex-col gap-4 custom-scrollbar"
      >
        {messages?.map((msg, index) => {
          return msg.type === "question" ? (
            <div key={index} className="flex justify-end ">
              <span className="py-2 px-3 rounded-b-xl rounded-tl-xl bg-zinc-800 max-w-8/10 leading-10">
                {msg.text}
              </span>
            </div>
          ) : (
            <div
              key={index}
              className="py-2 px-3 rounded-b-xl rounded-tr-xl bg-zinc-800 w-fit max-w-8/10 leading-10"
            >
              <TypingMarkdown message={msg} scrollToBottom={scrollToBottom} />
            </div>
          );
        })}
        {loading && (
          <div className="py-2 px-3 flex w-fit max-w-8/10 gap-2">
            <span className="sr-only">Loading...</span>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
          </div>
        )}
      </section>
      <ChatFooter scrollToBottom={scrollToBottom} />
    </>
  );
}
