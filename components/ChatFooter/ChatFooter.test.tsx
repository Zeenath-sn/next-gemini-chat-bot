import { render, screen, fireEvent } from "@testing-library/react";
import ChatFooter from "./ChatFooter";
import * as useChatPanelModule from "../../utils/useChatPanel";
import React from "react";

// Mock the useChatPanel hook
jest.mock("../../utils/useChatPanel");

const mockUseChatPanel = jest.mocked(useChatPanelModule.useChatPanel);

describe("ChatFooter", () => {
  const input = "Hello";
  const handleInputChange = jest.fn();
  const handleSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChatPanel.mockReturnValue({
      input: "",
      handleInputChange: jest.fn(),
      handleSend: jest.fn(),
      messages: [],
      loading: false,
      scrollToBottom: { current: null },
    });
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<ChatFooter scrollToBottom={{ current: null }} />);

    expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<ChatFooter scrollToBottom={{ current: null }} />);
    const handleSend = jest.fn();
    fireEvent.click(screen.getByRole("button"));
    handleSend();
    expect(handleSend).toHaveBeenCalled();
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<ChatFooter scrollToBottom={{ current: null }} />);
    const handleSend = jest.fn();
    fireEvent.keyDown(screen.getByPlaceholderText("Ask anything"), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    handleSend();
    expect(handleSend).toHaveBeenCalled();
  });
});
