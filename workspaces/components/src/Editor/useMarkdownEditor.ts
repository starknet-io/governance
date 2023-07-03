import { useState } from "react";
import { serialize } from "remark-slate";

export function useMarkdownEditor(initialValue: any) {
  const [editorValue, setEditorValue] = useState(initialValue);

  const handleEditorChange = (value: any[]) => {
    console.log(value);
    setEditorValue(value.map((v) => serialize(v)).join(""));
  };

  return { editorValue, handleEditorChange };
}
