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
        h1: ({ ...props }) => <Heading variant="h1" as="h1" {...props} />,
        h2: ({ ...props }) => <Heading variant="h2" as="h2" {...props} />,
        h3: ({ ...props }) => <Heading variant="h3" as="h3" {...props} />,
        h4: ({ ...props }) => <Heading variant="h4" as="h4" {...props} />,
        h5: ({ ...props }) => <Heading variant="h5" as="h5" {...props} />,
        h6: ({ ...props }) => <Heading variant="h6" as="h6" {...props} />,
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
