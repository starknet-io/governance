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
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  if (isBrowser) {
    return (
      <Suspense
        fallback={
          <Box>
            <Spinner />
          </Box>
        }
      >
        <Quill
          className={readOnly ? "quill_readonly" : ""}
          onChange={onChange}
          theme="snow"
          value={value}
          readOnly={readOnly}
          modules={modules}
        />
      </Suspense>
    );
  } else {
    return (
      <HStack minHeight="147px" alignItems="center" justifyContent="center">
        <Spinner />
      </HStack>
    );
  }
};
