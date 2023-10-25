// /workspaces/components/MarkdownRenderer.tsx
// todo use chakra components for list and list items
import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, Code } from "@chakra-ui/react";
import { Heading } from "../Heading";
import { Text, LocalTextProps } from "../Text";
import "./bodyText.css";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface MarkdownRendererProps {
  content: string;
  textProps?: LocalTextProps;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  textProps,
  className = "markdown-body",
}) => {
  const preprocessContent = (content: string) => {
    return content.replace(/==([^=]+)==/g, "<highlight>$1</highlight>");
  };
  const newTheme = {
    highlight: ({ ...props }) => (
      <Text
        variant="large"
        {...props}
        mb="standard.md"
        mt="standard.xs"
        color="content.default.default"
        background="yellow"
        {...textProps}
      />
    ),
    h1: ({ ...props }) => (
      <Heading
        variant="h3"
        {...props}
        mt="standard.lg"
        mb="standard.base"
        color="content.accent.default"
      />
    ),
    h2: ({ ...props }) => (
      <Heading
        variant="h4"
        mt="standard.lg"
        mb="standard.base"
        {...props}
        color="content.accent.default"
      />
    ),
    h3: ({ ...props }) => (
      <Heading
        variant="h4"
        mt="standard.lg"
        mb="standard.base"
        {...props}
        color="content.accent.default"
      />
    ),
    h4: ({ ...props }) => (
      <Heading
        variant="h4"
        mt="standard.lg"
        mb="standard.base"
        {...props}
        color="content.accent.default"
      />
    ),
    h5: ({ ...props }) => (
      <Heading
        variant="h4"
        mt="standard.lg"
        mb="standard.base"
        {...props}
        color="content.accent.default"
      />
    ),
    h6: ({ ...props }) => (
      <Heading
        variant="h4"
        mt="standard.lg"
        mb="standard.base"
        {...props}
        color="content.accent.default"
      />
    ),
    p: ({ ...props }) => (
      <Text
        variant="large"
        {...props}
        mb="standard.md"
        mt="standard.xs"
        color="content.default.default"
        {...textProps}
      />
    ),
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      if (inline) {
        return <Code {...props}>{children}</Code>;
      }
      return match ? (
        <SyntaxHighlighter
          style={{ ...xonokai }}
          language={match[1]}
          PreTag={Box}
          wrapLines
          showLineNumbers
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <Code {...props}>{children}</Code>
      );
    },
    ol: ({ ...props }) => (
      <ol
        style={{
          fontFamily: `'Inter Variable', sans-serif`,
          fontSize: "15px",
          lineHeight: "24px",
          paddingLeft: 17,
          marginBottom: 16,
          marginTop: "8px",
        }}
        {...props}
        color="content.default.default"
      />
    ),
    ul: ({ ...props }) => (
      <ul
        style={{
          fontFamily: `'Inter Variable', sans-serif`,
          fontSize: "15px",
          lineHeight: "24px",
          paddingLeft: 17,
          marginBottom: 16,
          marginTop: "8px",
        }}
        {...props}
        color="#4A4A4F"
      />
    ),
    li: ({ ...props }) => (
      <li
        style={{
          marginBottom: "8px",
        }}
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        style={{
          borderLeft: "3px solid content.default.default",
          paddingLeft: "12px",
          marginBottom: 18,
          color: "content.default.default",
          fontFamily: `'Inter Variable', sans-serif`,
          fontSize: "15px",
          lineHeight: "24px",

          marginTop: "8px",
        }}
        {...props}
      />
    ),
    a: ({ ...props }) => (
      <Text
        as="a"
        display="inline-block"
        fontWeight="medium"
        color="content.links.default"
        cursor="pointer"
        {...props}
      />
    ),
    img: ({ ...props }) => (
      <Box>
        <img {...props} />
      </Box>
    ),
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={className}
      components={ChakraUIRenderer(newTheme)}
      skipHtml
    >
      {preprocessContent(content)}
    </ReactMarkdown>
  );
};
