import React, { useEffect, useState, Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import "./quill-editor.css";
import { Box, HStack, Spinner } from "@chakra-ui/react";
const Quill =
  typeof window !== "undefined"
    ? React.lazy(() => import("react-quill"))
    : () => <div />;

interface QuillEditorProps {
  value: string | undefined;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  maxLength?: number;
  minHeight?: number;
  noToolbar?: boolean;
  placeholder?: string | undefined;
}

const modules = {
  toolbar: [
    ["bold", "italic"],
    [{ header: "1" }, { header: "2" }],
    [{ size: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export const QuillEditor: React.FC<QuillEditorProps> = ({
  onChange,
  value,
  readOnly = false,
  maxLength = Infinity,
  minHeight = 50,
  noToolbar = false,
  placeholder,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  });

  const handleQuillChange = (
    content: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    if (editor.getLength()) {
      setCharacterCount(editor.getLength());
    }
    onChange?.(content);
  };

  if (isBrowser) {
    return (
      <Suspense
        fallback={
          <Box>
            <Spinner />
          </Box>
        }
      >
        <Box position={"relative"}>
          {readOnly ? (
            <></>
          ) : (
            <Box
              position={"absolute"}
              top="-32px"
              right="0"
              display="flex"
              justifyContent="end"
              fontSize="12px"
            >
              <span>
                {characterCount}/{maxLength}
              </span>
            </Box>
          )}
          <Quill
            className={readOnly ? "quill_readonly" : ""}
            onChange={(content, delta, source, editor) =>
              handleQuillChange(content, delta, source, editor)
            }
            style={{ minHeight: `${minHeight}px` }}
            theme="snow"
            value={value}
            readOnly={readOnly}
            modules={noToolbar ? { toolbar: null } : modules}
            placeholder={placeholder ?? ""}
          />
        </Box>
      </Suspense>
    );
  } else {
    return (
      <HStack minHeight="50px" alignItems="center" justifyContent="center">
        <Spinner />
      </HStack>
    );
  }
};
