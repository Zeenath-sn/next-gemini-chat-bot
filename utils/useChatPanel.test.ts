import { renderHook, act, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useChatPanel } from "./useChatPanel";
import {
  setLoading,
  updateMessages,
  updateRecentHistory,
} from "../features/chatBotSlice";

// Mock dependencies
jest.mock("react-redux");
jest.mock("@google/generative-ai");

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

describe("useChatPanel", () => {
  const mockDispatch = jest.fn();
  const mockScrollContainer = document.createElement("div");
  const mockScrollToBottom = { current: mockScrollContainer };

  const defaultProps = {
    scrollToBottom: mockScrollToBottom,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          messages: [],
          loading: false,
          selectedHistory: "",
        },
      }),
    );
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useChatPanel(defaultProps));

    expect(result.current.input).toBe("");
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.scrollToBottom).toBe(mockScrollToBottom);
  });

  it("should load history from localStorage on mount", () => {
    localStorage.setItem("history", JSON.stringify(["previous question"]));

    renderHook(() => useChatPanel(defaultProps));

    expect(mockDispatch).toHaveBeenCalledWith(
      updateRecentHistory(["previous question"]),
    );
  });

  it("should handle empty history gracefully", () => {
    renderHook(() => useChatPanel(defaultProps));

    expect(mockDispatch).toHaveBeenCalledWith(updateRecentHistory([]));
  });

  it("should handle invalid history JSON gracefully", () => {
    localStorage.setItem("history", "invalid json");

    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    renderHook(() => useChatPanel(defaultProps));

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(updateRecentHistory([]));

    consoleWarnSpy.mockRestore();
  });

  it("should update input on handleInputChange", () => {
    const { result } = renderHook(() => useChatPanel(defaultProps));

    const mockEvent = {
      target: { value: "Hello, world!" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.input).toBe("Hello, world!");
  });

  it("should handle input changes with empty string", () => {
    const { result } = renderHook(() => useChatPanel(defaultProps));

    const mockEvent = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.input).toBe("");
  });

  it("should return false when sending empty message", async () => {
    const { result } = renderHook(() => useChatPanel(defaultProps));

    let sendResult;
    await act(async () => {
      sendResult = await result.current.handleSend();
    });

    expect(sendResult).toBe(false);
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringMatching(/updateMessages/),
      }),
    );
  });

  it("should send message from input and save to history", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    let sendResult;
    await act(async () => {
      sendResult = await result.current.handleSend();
    });

    expect(sendResult).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateMessages({ type: "question", text: "Test question" }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    expect(history).toContain("Test question");
  });

  it("should use selectedHistory when input is empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        chatBot: {
          messages: [],
          loading: false,
          selectedHistory: "Previous question",
        },
      }),
    );

    const { result } = renderHook(() => useChatPanel(defaultProps));

    let sendResult;
    await act(async () => {
      sendResult = await result.current.handleSend();
    });

    expect(sendResult).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateMessages({ type: "question", text: "Previous question" }),
    );
  });

  it("should trim whitespace from input", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "  Test question  " },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    let sendResult;
    await act(async () => {
      sendResult = await result.current.handleSend();
    });

    expect(sendResult).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateMessages({ type: "question", text: "Test question" }),
    );
  });

  it("should clear input after sending message", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.input).toBe("Test question");

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.input).toBe("");
  });

  it("should maintain history limit of 50 items", async () => {
    const initialHistory = Array.from({ length: 50 }, (_, i) => `Q${i}`);
    localStorage.setItem("history", JSON.stringify(initialHistory));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "New question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSend();
    });

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    expect(history.length).toBe(50);
    expect(history[0]).toBe("New question");
  });

  it("should handle API error response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            reply: { error: { message: "API Error" } },
          }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSend();
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });

  it("should handle fetch error gracefully", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error")),
    ) as jest.Mock;

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSend();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating content:",
        expect.any(Error),
      );
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    consoleErrorSpy.mockRestore();
  });

  it("should call API with correct parameters", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Test question" }),
    });
  });

  it("should dispatch setLoading(false) after generating content", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ reply: "Test response" }),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useChatPanel(defaultProps));

    await act(async () => {
      result.current.handleInputChange({
        target: { value: "Test question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSend();
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });
  });
});
