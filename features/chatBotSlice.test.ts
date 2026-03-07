import chatBotSlice, {
  updateMessages,
  setLoading,
  updateRecentHistory,
  clearRecentHistory,
  updateSelectedHistory,
} from "./chatBotSlice";
import { initialState } from "./chatBotInitialState";
import type { MessageObj } from "./types";

describe("chatBotSlice", () => {
  it("should return the initial state", () => {
    expect(chatBotSlice(undefined, { type: "" })).toEqual(initialState);
  });

  describe("updateMessages", () => {
    it("should add a message to the messages array", () => {
      const message: MessageObj = { type: "question", text: "Hello" };
      const actual = chatBotSlice(initialState, updateMessages(message));
      expect(actual.messages).toEqual([message]);
      expect(actual.loading).toBe(false); // other state unchanged
    });

    it("should add multiple messages", () => {
      const message1: MessageObj = { type: "question", text: "Hello" };
      const message2: MessageObj = { type: "answer", text: "Hi there" };
      let state = chatBotSlice(initialState, updateMessages(message1));
      state = chatBotSlice(state, updateMessages(message2));
      expect(state.messages).toEqual([message1, message2]);
    });
  });

  describe("setLoading", () => {
    it("should set loading to true", () => {
      const actual = chatBotSlice(initialState, setLoading(true));
      expect(actual.loading).toBe(true);
      expect(actual.messages).toEqual([]); // other state unchanged
    });

    it("should set loading to false", () => {
      const stateWithLoading = { ...initialState, loading: true };
      const actual = chatBotSlice(stateWithLoading, setLoading(false));
      expect(actual.loading).toBe(false);
    });
  });

  describe("updateRecentHistory", () => {
    it("should update recentHistory with new array", () => {
      const history = ["How are you?", "What is React?"];
      const actual = chatBotSlice(initialState, updateRecentHistory(history));
      expect(actual.recentHistory).toEqual(history);
      expect(actual.selectedHistory).toBe(""); // other state unchanged
    });

    it("should replace existing recentHistory", () => {
      const stateWithHistory = { ...initialState, recentHistory: ["old"] };
      const newHistory = ["new1", "new2"];
      const actual = chatBotSlice(
        stateWithHistory,
        updateRecentHistory(newHistory),
      );
      expect(actual.recentHistory).toEqual(newHistory);
    });
  });

  describe("clearRecentHistory", () => {
    it("should clear recentHistory to empty array", () => {
      const stateWithHistory = { ...initialState, recentHistory: ["a", "b"] };
      const actual = chatBotSlice(stateWithHistory, clearRecentHistory());
      expect(actual.recentHistory).toEqual([]);
      expect(actual.messages).toEqual([]); // other state unchanged
    });

    it("should work on empty recentHistory", () => {
      const actual = chatBotSlice(initialState, clearRecentHistory());
      expect(actual.recentHistory).toEqual([]);
    });
  });

  describe("updateSelectedHistory", () => {
    it("should update selectedHistory", () => {
      const selected = "Selected item";
      const actual = chatBotSlice(
        initialState,
        updateSelectedHistory(selected),
      );
      expect(actual.selectedHistory).toBe(selected);
      expect(actual.loading).toBe(false); // other state unchanged
    });

    it("should replace existing selectedHistory", () => {
      const stateWithSelected = { ...initialState, selectedHistory: "old" };
      const newSelected = "new";
      const actual = chatBotSlice(
        stateWithSelected,
        updateSelectedHistory(newSelected),
      );
      expect(actual.selectedHistory).toBe(newSelected);
    });
  });
});
