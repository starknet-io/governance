// /workspaces/components/MarkdownRenderer.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import { Code } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { Text, LocalTextProps } from "src/Text/Text";

interface MarkdownRendererProps {
  content: string;
  textProps?: LocalTextProps;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  textProps,
}) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => <Heading variant="h1" {...props} />,
        h2: ({ ...props }) => <Heading variant="h2" {...props} />,
        h3: ({ ...props }) => <Heading variant="h3" {...props} />,
        h4: ({ ...props }) => <Heading variant="h4" {...props} />,
        h5: ({ ...props }) => <Heading variant="h5" {...props} />,
        h6: ({ ...props }) => <Heading variant="h6" {...props} />,
        p: ({ ...props }) => (
          <Text variant="medium" {...textProps} {...props} />
        ),
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
