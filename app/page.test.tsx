import { render, screen } from "@testing-library/react";
import Home from "./page";
import React from "react";

jest.mock("@/components/ChatMessages/ChatMessages", () => {
  const ChatMessagesStub = () => (
    <div data-testid="chat-messages">ChatMessages</div>
  );
  ChatMessagesStub.displayName = "ChatMessages";
  return ChatMessagesStub;
});

describe("Home", () => {
  it("displays the correct content", () => {
    render(<Home />);

    expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
    expect(screen.getByText("Hello, Ask me anything!")).toBeInTheDocument();
  });
});
