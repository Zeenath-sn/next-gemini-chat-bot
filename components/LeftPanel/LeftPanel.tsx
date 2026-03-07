"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLeftPanel } from "./useLeftPanel";
import React from "react";

function LeftPanel() {
  const scrollToBottom = React.useRef<HTMLDivElement>(null);
  const {
    handleDeleteClick,
    handleHistoryClick,
    recentHistory,
    selectedHistory,
  } = useLeftPanel({ scrollToBottom });

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <header className="pt-6 flex gap-2 items-center justify-center">
        <h3 className="text-white text-2xl">Recent Chats</h3>
        <button onClick={handleDeleteClick}>
          <FontAwesomeIcon
            icon={faTrash}
            className="text-white text-lg cursor-pointer"
          />
        </button>
      </header>
      <ul className="text-white text-lg p-2 w-full h-(--left-panel-height) overflow-y-auto custom-scrollbar">
        {recentHistory?.map((history: string, index: number) => {
          return (
            <li
              key={index}
              className={`${
                selectedHistory === history
                  ? "p-2 truncate rounded-md bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer mb-2"
                  : "p-2 truncate text-zinc-400 rounded-md hover:bg-zinc-700 hover:text-white cursor-pointer mb-2"
              }`}
              onClick={() => handleHistoryClick(history)}
            >
              {history}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LeftPanel;
