import ChatMessages from "@/components/ChatMessages/ChatMessages";
import React from "react";

export default function Home() {
  return (
    <div className="text-white">
      <header>
        <h2 className="p-2 text-4xl w-full flex items-center justify-center pt-8  bg-clip-text text-transparent bg-linear-to-r from-pink-700 to-violet-700 ">
          Hello, Ask me anything!
        </h2>
      </header>
      <ChatMessages />
    </div>
  );
}
