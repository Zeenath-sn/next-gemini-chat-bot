import { renderHook, act } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useLeftPanel } from "./useLeftPanel";
import {
  clearRecentHistory,
  updateSelectedHistory,
} from "../../features/chatBotSlice";
import { useChatPanel } from "../../utils/useChatPanel";

// Mock dependencies
jest.mock("react-redux");
jest.mock("../../utils/useChatPanel");

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLeftPanel", () => {
  const mockDispatch = jest.fn();
  const mockHandleSend = jest.fn();
  const mockScrollToBottom = jest.fn();

  const defaultProps = {
    scrollToBottom: mockScrollToBottom,
  };

  const defaultRecentHistory = [
    "How are you?",
    "What is React?",
    "Explain JavaScript",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: defaultRecentHistory,
          selectedHistory: "",
        },
      }),
    );

    (useChatPanel as jest.Mock).mockReturnValue({
      handleSend: mockHandleSend,
    });
  });

  it("should initialize with default values from Redux", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(result.current.recentHistory).toEqual(defaultRecentHistory);
    expect(result.current.selectedHistory).toBe("");
  });

  it("should select correct state from Redux store", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(useSelector).toHaveBeenCalled();
    // Verify the selector extracts the right fields
    expect(result.current.recentHistory).toEqual(defaultRecentHistory);
    expect(result.current.selectedHistory).toBe("");
  });

  it("should clear localStorage on handleDeleteClick", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    localStorage.setItem("testKey", "testValue");
    localStorage.setItem("history", JSON.stringify(defaultRecentHistory));

    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(localStorage.getItem("testKey")).toBeNull();
    expect(localStorage.getItem("history")).toBeNull();
  });

  it("should dispatch clearRecentHistory on handleDeleteClick", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearRecentHistory());
  });

  it("should dispatch updateSelectedHistory on handleHistoryClick", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    const selectedItem = "How are you?";

    act(() => {
      result.current.handleHistoryClick(selectedItem);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSelectedHistory(selectedItem),
    );
  });

  it("should handle multiple history item selections", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleHistoryClick("First item");
    });

    act(() => {
      result.current.handleHistoryClick("Second item");
    });

    act(() => {
      result.current.handleHistoryClick("Third item");
    });

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenNthCalledWith(
      1,
      updateSelectedHistory("First item"),
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      updateSelectedHistory("Second item"),
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(
      3,
      updateSelectedHistory("Third item"),
    );
  });

  it("should call handleSend on mount when selectedHistory is set", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: defaultRecentHistory,
          selectedHistory: "How are you?",
        },
      }),
    );

    renderHook(() => useLeftPanel(propsWithRef));

    expect(mockHandleSend).toHaveBeenCalled();
  });

  it("should call handleSend when selectedHistory changes", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { rerender } = renderHook(() => useLeftPanel(propsWithRef));

    expect(mockHandleSend).toHaveBeenCalledTimes(1);

    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: defaultRecentHistory,
          selectedHistory: "New selection",
        },
      }),
    );

    rerender();

    expect(mockHandleSend).toHaveBeenCalledTimes(2);
  });

  it("should not call handleSend when other state changes", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { rerender } = renderHook(() => useLeftPanel(propsWithRef));

    expect(mockHandleSend).toHaveBeenCalledTimes(1);

    // Change recentHistory but not selectedHistory
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: [...defaultRecentHistory, "New item"],
          selectedHistory: "",
        },
      }),
    );

    rerender();

    // handleSend should still only be called once since selectedHistory didn't change
    expect(mockHandleSend).toHaveBeenCalledTimes(1);
  });

  it("should return handleDeleteClick function", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(typeof result.current.handleDeleteClick).toBe("function");
  });

  it("should return handleHistoryClick function", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(typeof result.current.handleHistoryClick).toBe("function");
  });

  it("should handle empty recentHistory", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: [],
          selectedHistory: "",
        },
      }),
    );
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };

    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(result.current.recentHistory).toEqual([]);
  });

  it("should handle null/undefined selectedHistory", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          recentHistory: defaultRecentHistory,
          selectedHistory: undefined,
        },
      }),
    );
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };

    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    expect(result.current.selectedHistory).toBeUndefined();
  });

  it("should handle history item with special characters", () => {
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const specialHistoryItem = 'What is "React"? <script>alert("xss")</script>';
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleHistoryClick(specialHistoryItem);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSelectedHistory(specialHistoryItem),
    );
  });

  it("should handle delete click when localStorage is already empty", () => {
    localStorage.clear();
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleDeleteClick();
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearRecentHistory());
  });

  it("should handle rapid consecutive delete calls", () => {
    localStorage.setItem("data", "value");
    const mockRef = { current: document.createElement("div") };
    const propsWithRef = {
      scrollToBottom: mockRef,
    };
    const { result } = renderHook(() => useLeftPanel(propsWithRef));

    act(() => {
      result.current.handleDeleteClick();
      result.current.handleDeleteClick();
      result.current.handleDeleteClick();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith(clearRecentHistory());
    expect(localStorage.getItem("data")).toBeNull();
  });

  it("should handle scrollToBottom as undefined", () => {
    const propsWithoutScroll = {
      scrollToBottom: undefined,
    } as never;

    renderHook(() => useLeftPanel(propsWithoutScroll));

    expect(useChatPanel).toHaveBeenCalledWith({
      scrollToBottom: undefined,
    });
  });
});
