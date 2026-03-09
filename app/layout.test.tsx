import React from "react";
import { render, screen } from "@testing-library/react";

// mock the global stylesheet import to avoid CSS parsing errors
jest.mock("./globals.css", () => ({}));

// Mock the font imports from next/font/google since they rely on Next.js internals
jest.mock("next/font/google", () => {
  return {
    Geist: jest.fn(() => ({ variable: "--font-geist-sans" })),
    Geist_Mono: jest.fn(() => ({ variable: "--font-geist-mono" })),
  };
});

import RootLayout from "./layout";

// Replace Providers with a simple passthrough so we don't depend on Redux store
jest.mock("./Providers", () => {
  return {
    Providers: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="providers">{children}</div>
    ),
  };
});

// Replace LeftPanel with a simple stub so we can detect its rendering
jest.mock("@/components/LeftPanel/LeftPanel", () => {
  const LeftPanelStub = () => <div data-testid="left-panel">LeftPanel</div>;
  LeftPanelStub.displayName = "LeftPanel";
  return LeftPanelStub;
});

describe("RootLayout", () => {
  it("includes the LeftPanel and displays children", () => {
    render(
      <RootLayout>
        <span>child content</span>
      </RootLayout>,
    );

    expect(screen.getByTestId("left-panel")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
    // the Providers stub wraps content
    expect(screen.getByTestId("providers")).toBeInTheDocument();
  });
});
