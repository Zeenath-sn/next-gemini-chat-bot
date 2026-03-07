import { createElement } from "react";

const ReactMarkdown = ({ children, ...props }) => {
  return createElement("div", { ...props }, children);
};

export default ReactMarkdown;
