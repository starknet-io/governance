// /workspaces/components/MarkdownRenderer.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import { Heading, Text, Code } from "@chakra-ui/react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => <Heading as="h1" size="xl" {...props} />,
        h2: ({ ...props }) => <Heading as="h2" size="xl" {...props} />,
        p: ({ ...props }) => <Text {...props} />,
        code: ({ ...props }) => <Code {...props} />,
        ol: ({ ...props }) => <ol style={{ paddingLeft: 16 }} {...props} />,
        ul: ({ ...props }) => <ul style={{ paddingLeft: 16 }} {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            style={{
              color: "grey",
              borderLeft: "3px solid grey",
              paddingLeft: 8,
            }}
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
