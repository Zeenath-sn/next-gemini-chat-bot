module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react" } }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-markdown|remark-gfm|micromark|mdast-util-.*|ccount|escape-string-regexp|unist-.*)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js",
  },
};
