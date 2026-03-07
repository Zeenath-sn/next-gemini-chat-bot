import { useChatPanel } from "@/utils/useChatPanel";
import React from "react";
import { ChatProps } from "@/features/types";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatFooter(props: ChatProps) {
  const { input, handleInputChange, handleSend } = useChatPanel(props);

  return (
    <div
      className=" p-2 rounded-3xl border-zinc-700 bg-zinc-800 my-10 absolute bottom-0 w-[70%] left-[16%] flex gap-2 items-center"
      onKeyDown={(event) => {
        event.key === "Enter" &&
          !event.shiftKey &&
          !event.ctrlKey &&
          !event.altKey &&
          handleSend();
      }}
    >
      <input
        placeholder="Ask anything"
        className=" p-4 w-full outline-none"
        value={input}
        onChange={handleInputChange}
      />
      <button
        className="text-lg outline-none hover:cursor-pointer h-fit mr-2"
        onClick={() => handleSend()}
      >
        <FontAwesomeIcon icon={faArrowCircleRight} className="text-2xl " />
      </button>
    </div>
  );
}
