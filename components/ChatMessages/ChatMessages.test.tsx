import { render, screen, fireEvent } from "@testing-library/react";
import ChatMessages from "./ChatMessages";
import * as useChatPanelModule from "../../utils/useChatPanel";
import React from "react";

// Mock the useChatPanel hook
jest.mock("../../utils/useChatPanel");
jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown">{children}</div>;
  };
});

const mockUseChatPanel = jest.mocked(useChatPanelModule.useChatPanel);

describe("ChatMessages", () => {
  const messages: Array<{ text: string; type: "question" | "answer" }> = [
    {
      text: "Hi there!",
      type: "question",
    },
    {
      text: "Hello, how can I help you?",
      type: "answer",
    },
    {
      text: "What is React?",
      type: "question",
    },
  ];
  const loading = false;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChatPanel.mockReturnValue({
      input: "",
      handleInputChange: jest.fn(),
      handleSend: jest.fn(),
      messages: messages,
      loading: loading,
      scrollToBottom: { current: null },
    });
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<ChatMessages />);

    expect(screen.getByText("What is React?")).toBeInTheDocument();
  });
});

describe("ChatMessages", () => {
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
    render(<ChatMessages />);

    expect(screen.queryByText("What is React?")).not.toBeInTheDocument();
  });
});

describe("ChatMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChatPanel.mockReturnValue({
      input: "",
      handleInputChange: jest.fn(),
      handleSend: jest.fn(),
      messages: [],
      loading: true,
      scrollToBottom: { current: null },
    });
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<ChatMessages />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
