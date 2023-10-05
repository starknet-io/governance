import { useEffect, useMemo, useState } from "react";
import { serialize } from "remark-slate";
import { unified } from "unified";
import markdown from "remark-parse";
import slate from "remark-slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { ParagraphElement } from "./initialValue";

export function useMarkdownEditor(
  initialValue?: any,
  initialSlateData?: ParagraphElement[],
) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    initialSlateData && editor.insertNodes(initialSlateData);
  }, []);

  const [editorValue, setEditorValue] = useState(initialValue);

  const handleEditorChange = (value: any[]) => {
    setEditorValue(convertSlateToMarkdown(value));
  };

  const clearEditor = () => {
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
  }

  const resetEditorValue = () => {
    setEditorValue(initialValue);
  };

  const setMarkdownValue = async (value: string) => {
    const result = await convertMarkdownToSlate(value);
    result && editor.insertNodes(result);
    setEditorValue(result);
  };

  const convertSlateToMarkdown = (value: any[]) => {
    return value.map((v) => serialize(v)?.replaceAll("<br>", "")).join("");
  };

  const convertMarkdownToSlate = (
    markdownContent: string,
  ): Promise<ParagraphElement[]> => {
    return new Promise((resolve, reject) => {
      unified()
        .use(markdown)
        .use(slate)
        .process(markdownContent, (err, file) => {
          if (err) {
            reject(err);
          } else {
            resolve(file?.result as ParagraphElement[]);
          }
        });
    });
  };

  return {
    editorValue,
    handleEditorChange,
    resetEditorValue,
    convertMarkdownToSlate,
    convertSlateToMarkdown,
    setMarkdownValue,
    editor,
    clearEditor,
  };
}
