import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LeftPanel from "./LeftPanel";
import * as useLeftPanelModule from "./useLeftPanel";

// Mock the useLeftPanel hook
jest.mock("./useLeftPanel");

const mockUseLeftPanel = jest.mocked(useLeftPanelModule.useLeftPanel);

describe("LeftPanel", () => {
  const mockHandleDeleteClick = jest.fn();
  const mockHandleHistoryClick = jest.fn();
  const defaultRecentHistory = [
    "How are you?",
    "What is React?",
    "Explain JavaScript",
  ];
  const defaultSelectedHistory = "";

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLeftPanel.mockReturnValue({
      handleDeleteClick: mockHandleDeleteClick,
      handleHistoryClick: mockHandleHistoryClick,
      recentHistory: defaultRecentHistory,
      selectedHistory: defaultSelectedHistory,
    });
  });

  it("renders the header with Recent Chats and delete button", () => {
    render(<LeftPanel />);

    expect(screen.getByText("Recent Chats")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the list of recent history items", () => {
    render(<LeftPanel />);

    defaultRecentHistory.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("highlights the selected history item", () => {
    mockUseLeftPanel.mockReturnValue({
      handleDeleteClick: mockHandleDeleteClick,
      handleHistoryClick: mockHandleHistoryClick,
      recentHistory: defaultRecentHistory,
      selectedHistory: "What is React?",
    });

    render(<LeftPanel />);

    const selectedItem = screen.getByText("What is React?");
    expect(selectedItem).toHaveClass("bg-zinc-700 text-zinc-400");
  });

  it("calls handleDeleteClick when delete button is clicked", () => {
    render(<LeftPanel />);

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteClick).toHaveBeenCalledTimes(1);
  });

  it("calls handleHistoryClick when a history item is clicked", () => {
    render(<LeftPanel />);

    const historyItem = screen.getByText("How are you?");
    fireEvent.click(historyItem);

    expect(mockHandleHistoryClick).toHaveBeenCalledWith("How are you?");
  });

  it("handles empty recentHistory", () => {
    mockUseLeftPanel.mockReturnValue({
      handleDeleteClick: mockHandleDeleteClick,
      handleHistoryClick: mockHandleHistoryClick,
      recentHistory: [],
      selectedHistory: defaultSelectedHistory,
    });

    render(<LeftPanel />);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("handles undefined selectedHistory", () => {
    mockUseLeftPanel.mockReturnValue({
      handleDeleteClick: mockHandleDeleteClick,
      handleHistoryClick: mockHandleHistoryClick,
      recentHistory: defaultRecentHistory,
      selectedHistory: "",
    });

    render(<LeftPanel />);

    // No item should be highlighted
    const items = screen.getAllByRole("listitem");
    items.forEach((item) => {
      expect(item).not.toHaveClass("bg-zinc-700");
    });
  });

  it("renders history items with correct classes when not selected", () => {
    render(<LeftPanel />);

    const historyItem = screen.getByText("How are you?");
    expect(historyItem).toHaveClass("text-zinc-400");
    expect(historyItem).not.toHaveClass("bg-zinc-700");
  });

  it("handles multiple history items and clicks", () => {
    render(<LeftPanel />);

    const firstItem = screen.getByText("How are you?");
    const secondItem = screen.getByText("What is React?");

    fireEvent.click(firstItem);
    fireEvent.click(secondItem);

    expect(mockHandleHistoryClick).toHaveBeenCalledWith("How are you?");
    expect(mockHandleHistoryClick).toHaveBeenCalledWith("What is React?");
  });

  it("renders with special characters in history", () => {
    const specialHistory = [
      'What is "React"?',
      '<script>alert("xss")</script>',
    ];
    mockUseLeftPanel.mockReturnValue({
      handleDeleteClick: mockHandleDeleteClick,
      handleHistoryClick: mockHandleHistoryClick,
      recentHistory: specialHistory,
      selectedHistory: defaultSelectedHistory,
    });

    render(<LeftPanel />);

    expect(screen.getByText('What is "React"?')).toBeInTheDocument();
    expect(
      screen.getByText('<script>alert("xss")</script>'),
    ).toBeInTheDocument();
  });
});
