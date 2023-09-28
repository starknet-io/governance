// /workspaces/components/MarkdownRenderer.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import { Code } from "@chakra-ui/react";
import { Heading } from "../Heading";
import { Text, LocalTextProps } from "../Text";

export interface MarkdownRendererProps {
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
        h1: ({ ...props }) => (
          <Heading variant="h3" {...props} mt="20px" mb="4px" />
        ),
        h2: ({ ...props }) => (
          <Heading variant="h4" mt="20px" mb="4px" {...props} />
        ),
        h3: ({ ...props }) => (
          <Heading variant="h4" mt="20px" mb="4px" {...props} />
        ),
        h4: ({ ...props }) => (
          <Heading variant="h4" mt="20px" mb="4px" {...props} />
        ),
        h5: ({ ...props }) => (
          <Heading variant="h4" mt="20px" mb="4px" {...props} />
        ),
        h6: ({ ...props }) => (
          <Heading variant="h4" mt="20px" mb="4px" {...props} />
        ),
        p: ({ ...props }) => (
          <Text variant="large" {...textProps} {...props} mb="16px" mt="8px" />
        ),
        code: ({ ...props }) => (
          <Code maxWidth="100%" p="16px" {...props} mb="18px" />
        ),
        ol: ({ ...props }) => (
          <ol style={{ paddingLeft: 16, marginBottom: 18 }} {...props} />
        ),
        ul: ({ ...props }) => (
          <ul style={{ paddingLeft: 16, marginBottom: 18 }} {...props} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            style={{
              borderLeft: "3px solid #DCDBDD",
              paddingLeft: "12px",
              marginBottom: 18,
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
