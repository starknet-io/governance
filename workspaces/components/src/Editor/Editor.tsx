import React, { useEffect, useState, Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import "./quill-editor.css";

const Quill =
  typeof window !== "undefined"
    ? React.lazy(() => import("react-quill"))
    : () => <div />;

interface QuillEditorProps {
  value: string | undefined;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

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
      <Suspense fallback={<div>Loading...</div>}>
        <Quill
          className={readOnly ? "quill_readonly" : ""}
          onChange={onChange}
          theme="snow"
          value={value}
          readOnly={readOnly}
        />
      </Suspense>
    );
  } else {
    return <>Loading...</>;
  }
};
