import { useEffect, useMemo, useState } from "react";
import markdown from "remark-parse";
import slate, { serialize } from "remark-slate";
import { Editor, Transforms } from "slate";
import { unified } from "unified";
import { ParagraphElement } from "./initialValue";
import { createEditorWithPlugins } from "./plugins/createEditorWithPlugins";

function normalizeSlateList(arr: Array<any>) {
  return [...arr].map((item) => {
    // Check if the type is 'ol_list' or 'ul_list'
    if (item.type === "ol_list" || item.type === "ul_list") {
      // Map the children to a new structure
      item.children = item.children.map((listItem) => {
        // Assuming that each list item has only one 'paragraph' child
        if (listItem.children && listItem.children[0].type === "paragraph") {
          // Replace the list item's children with the paragraph's children
          return { ...listItem, children: listItem.children[0].children };
        }
        return listItem;
      });
    }
    return item;
  });
}

export function useMarkdownEditor(
  initialValue?: any,
  initialSlateData?: ParagraphElement[],
) {
  const editor = useMemo(() => {
    return createEditorWithPlugins();
  }, []);
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
            resolve(normalizeSlateList(file?.result as ParagraphElement[]));
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
