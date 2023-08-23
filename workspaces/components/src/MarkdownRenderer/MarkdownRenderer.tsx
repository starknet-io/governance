// /workspaces/components/MarkdownRenderer.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import { Heading, Text, Code } from "@chakra-ui/react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => <Heading as="h1" size="xl" {...props} />,
        h2: ({ ...props }) => <Heading as="h2" size="xl" {...props} />,
        p: ({ ...props }) => <Text {...props} />,
        code: ({ ...props }) => <Code {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
