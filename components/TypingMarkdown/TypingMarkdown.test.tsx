import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { TypingMarkdown } from "./TypingMarkdown";
import type { MessageObj } from "../../features/types";
import React from "react";

jest.mock("react-markdown", () => {
  return function MockMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown">{children}</div>;
  };
});

describe("TypingMarkdown component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing initially and then types the message text character by character", () => {
    const message = { text: "Hello world" } as MessageObj;
    const scrollContainer = document.createElement("div");
    Object.defineProperty(scrollContainer, "scrollHeight", {
      value: 1000,
      writable: false,
    });
    scrollContainer.scrollTo = jest.fn();

    const ref = { current: scrollContainer };

    const { getByTestId } = render(
      <TypingMarkdown message={message} scrollToBottom={ref} />,
    );

    const markdown = getByTestId("markdown");

    // Initially should be empty
    expect(markdown.textContent).toBe("");

    // First interval call (10ms) - still empty because i=0, slice(0,0)=""
    act(() => {
      jest.advanceTimersByTime(10);
    });
    expect(markdown.textContent).toBe("");
    expect(scrollContainer.scrollTo).toHaveBeenCalled();

    // Second interval call (20ms total) - i=1, slice(0,1)="H"
    act(() => {
      jest.advanceTimersByTime(10);
    });
    expect(markdown.textContent).toBe("H");

    // Continue advancing to get more characters
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(markdown.textContent).toContain("H");

    // Advance past the end to ensure full text
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(markdown.textContent).toBe("Hello world");
  });

  it("calls scrollTo on each typing interval", () => {
    const message = { text: "Test" } as MessageObj;
    const scrollContainer = document.createElement("div");
    Object.defineProperty(scrollContainer, "scrollHeight", {
      value: 500,
      writable: false,
    });
    scrollContainer.scrollTo = jest.fn();

    const ref = { current: scrollContainer };

    render(<TypingMarkdown message={message} scrollToBottom={ref} />);

    // Advance through multiple intervals
    act(() => {
      jest.advanceTimersByTime(30); // 3 intervals
    });

    expect(scrollContainer.scrollTo).toHaveBeenCalledWith({
      top: 500,
      behavior: "smooth",
    });
    expect(
      (scrollContainer.scrollTo as jest.Mock).mock.calls.length,
    ).toBeGreaterThan(0);
  });

  it("clears the interval when typing completes", () => {
    const message = { text: "Hi" } as MessageObj;
    const scrollContainer = document.createElement("div");
    Object.defineProperty(scrollContainer, "scrollHeight", {
      value: 100,
      writable: false,
    });
    scrollContainer.scrollTo = jest.fn();

    const ref = { current: scrollContainer };
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    render(<TypingMarkdown message={message} scrollToBottom={ref} />);

    // Advance past message length
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
