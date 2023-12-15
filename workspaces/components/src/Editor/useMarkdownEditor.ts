import { useEffect, useMemo, useState } from "react";
import { serialize } from "remark-slate";
import { unified } from "unified";
import markdown from "remark-parse";
import slate from "remark-slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { ParagraphElement } from "./initialValue";
import { withListsReact } from '@prezly/slate-lists';
import { withListsPlugin } from "./withListsPlugin";

function formatString(input) {
  // Split the input string by hyphen followed by any number of spaces
  const parts = input.split(/-\s*/);

  // Filter out empty strings and trim each part
  const formattedParts = parts.filter(part => part.trim() !== '').map(part => part.trim());

  // Join the parts with hyphen and new line
  const result = formattedParts.map(part => `- ${part}`).join('\n');

  return result;
}

export function useMarkdownEditor(
  initialValue?: any,
  initialSlateData?: ParagraphElement[],
) {
  const editor = useMemo(() => {
    const withInlines = (editor) => {
      const { isInline } = editor;
      editor.isInline = (element) => {
        return element.type === "link" ? true : isInline(element);
      };
      return editor;
    };

    // return withInlines(withHistory(withReact(createEditor())));
    return withListsReact(withListsPlugin(withInlines(withHistory(withReact(createEditor())))));
  }, []);
  useEffect(() => {
    initialSlateData && editor.insertNodes(initialSlateData);
  }, []);

  const [editorValue, setEditorValue] = useState(initialValue);

  const handleEditorChange = (value: any[]) => {
    const convertedValue = formatString(convertSlateToMarkdown(value));
    setEditorValue(convertedValue);
  };

  const clearEditor = () => {
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
  };

  const resetEditorValue = () => {
    setEditorValue(initialValue);
  };

  const setMarkdownValue = async (value: string) => {
    const result = await convertMarkdownToSlate(value);
    result && editor.insertNodes(result, { at: [0] });
    setEditorValue(result);
  };

  const convertSlateToMarkdown = (value: any[]) => {
    return value.map((v) => serialize(v)?.replaceAll("<br>", "")).join("\n");
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
