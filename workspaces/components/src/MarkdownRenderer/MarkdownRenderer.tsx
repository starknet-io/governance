import React from "react";
import ReactMarkdown from "react-markdown";
import { Box, Code, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Heading } from "../Heading";
import { Text, LocalTextProps } from "../Text";
import "./bodyText.css";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import he from "he";
import remarkEmoji from "remark-emoji";

export interface MarkdownRendererProps {
  content: string;
  textProps?: LocalTextProps;
  className?: string;
}
const Highlight: React.FC = ({ children }: React.PropsWithChildren<any>) => (
  <span style={{ backgroundColor: "#95EAB2" }}>{children}</span>
);

function applyHighlights(content: string) {
  return content.replace(/==([^=]+)==/g, "@@highlight@@$1@@/highlight@@");
}
function applyInsertions(content: string) {
  return content.replace(/\+\+([^+]+)\+\+/g, "<ins>$1</ins>");
}

function typographer(content: string) {
  return content
    .replace(/\(c\)/gi, "©")
    .replace(/\(r\)/gi, "®")
    .replace(/\(tm\)/gi, "™")
    .replace(/\(p\)/gi, "§")
    .replace(/\+-/g, "±");
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  textProps,
  className = "markdown-body",
}) => {
  const transformations = [
    applyHighlights,
    applyInsertions,
    typographer,
    he.decode,
  ];
  const processedContent = transformations.reduce(
    (content, transform) => transform(content),
    content,
  );

  const newTheme = {
    highlight: Highlight,
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
    blockquote: ({ ...props }) => (
      <blockquote
        style={{
          fontFamily: `'Inter Variable', sans-serif`,
          borderLeft: "3px solid rgba(35, 25, 45, 0.10)",
          marginTop: 8,
          paddingLeft: 8,
        }}
        {...props}
      />
    ),
    p: ({ children, ...props }: React.PropsWithChildren<any>) => {
      if (
        Array.isArray(children) &&
        children.some(
          (child) =>
            typeof child === "string" &&
            child.includes("@@highlight@@") &&
            child.includes("@@/highlight@@"),
        )
      ) {
        // Flatten and process the content
        return (
          <Text {...props}>
            {children.flatMap((child, index) => {
              if (
                typeof child === "string" &&
                child.includes("@@highlight@@")
              ) {
                const parts = child.split(/@@highlight@@|@@\/highlight@@/);
                return parts.map((part, partIndex) =>
                  partIndex % 2 === 1 ? (
                    <Highlight key={partIndex}>{part}</Highlight>
                  ) : (
                    part
                  ),
                );
              }
              return child;
            })}
          </Text>
        );
      }
      return (
        <Text
          variant="large"
          {...props}
          mb="standard.md"
          mt="standard.xs"
          color="content.default.default"
          {...textProps}
        >
          {children}
        </Text>
      );
    },

    table: ({ ...props }) => (
      <Table mt="24px" mb="24px" variant="simple" {...props} />
    ),
    thead: ({ ...props }) => <Thead {...props} />,
    tbody: ({ ...props }) => <Tbody {...props} />,
    tr: ({ ...props }) => <Tr {...props} />,
    th: ({ ...props }) => (
      <Th fontFamily="Inter variable" fontSize={"12px"} {...props} />
    ),
    td: ({ ...props }) => (
      <Td fontFamily="Inter variable" fontSize={"14px"} {...props} />
    ),

    code: (props): React.PropsWithChildren<any> => {
      const { inline, className, children, ...restProps } = props;

      const match = className ? /language-(\w+)/.exec(className) : null;
      if (inline) {
        return (
          <Code
            bg="surface.forms.selected"
            borderRadius="standard.base"
            {...restProps}
          >
            {children}
          </Code>
        );
      }
      return match ? (
        <SyntaxHighlighter
          style={{ ...xonokai }}
          language={match[1]}
          PreTag={Box}
          wrapLines
          showLineNumbers
          {...restProps}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <Code
          borderRadius="standard.base"
          p="standard.xs"
          bg="surface.forms.selected"
          fontSize={12}
          {...restProps}
        >
          {children}
        </Code>
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
        color="#4A4A4F"
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
          color: "#4A4A4F",
        }}
        {...props}
      />
    ),
    li: ({ ...props }) => (
      <li
        style={{
          marginBottom: "8px",
          color: "#4A4A4F",
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
      <Box mt="24px" mb="24px">
        <img {...props} />
      </Box>
    ),
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, [remarkEmoji]]}
      className={className}
      components={
        typeof ChakraUIRenderer === "function"
          ? ChakraUIRenderer(newTheme)
          : undefined
      }
    >
      {processedContent}
    </ReactMarkdown>
  );
};
