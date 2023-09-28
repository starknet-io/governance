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
          <Heading
            variant="h3"
            {...props}
            mt="standard.2xl"
            mb="4px"
            color="content.accent.default"
          />
        ),
        h2: ({ ...props }) => (
          <Heading
            variant="h4"
            mt="20px"
            mb="4px"
            {...props}
            color="content.accent.default"
          />
        ),
        h3: ({ ...props }) => (
          <Heading
            variant="h4"
            mt="20px"
            mb="4px"
            {...props}
            color="content.accent.default"
          />
        ),
        h4: ({ ...props }) => (
          <Heading
            variant="h4"
            mt="20px"
            mb="4px"
            {...props}
            color="content.accent.default"
          />
        ),
        h5: ({ ...props }) => (
          <Heading
            variant="h4"
            mt="20px"
            mb="4px"
            {...props}
            color="content.accent.default"
          />
        ),
        h6: ({ ...props }) => (
          <Heading
            variant="h4"
            mt="20px"
            mb="4px"
            {...props}
            color="content.accent.default"
          />
        ),
        p: ({ ...props }) => (
          <Text
            variant="large"
            {...textProps}
            {...props}
            mb="16px"
            mt="8px"
            color="content.default.default"
          />
        ),
        code: ({ ...props }) => (
          <Code maxWidth="100%" p="16px" {...props} mb="18px" />
        ),
        ol: ({ ...props }) => (
          <ol
            style={{ paddingLeft: 16, marginBottom: 18 }}
            {...props}
            color="content.default.default"
          />
        ),
        ul: ({ ...props }) => (
          <ul
            style={{ paddingLeft: 16, marginBottom: 18 }}
            {...props}
            color="content.default.default"
          />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            style={{
              borderLeft: "3px solid content.default.default",
              paddingLeft: "12px",
              marginBottom: 18,
              color: "content.default.default",
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
