import { useState } from "react";
import { deserialize, serialize } from "remark-slate";
import { fromMarkdown } from "mdast-util-from-markdown";

// import { unified } from "unified";
// import remarkParse from "remark-parse";
// import remarkRehype from "remark-rehype";
// import rehypeSanitize from "rehype-sanitize";
// import rehypeStringify from "rehype-stringify";
export function useMarkdownEditor(initialValue: any) {
  const [editorValue, setEditorValue] = useState(initialValue);

  const handleEditorChange = (value: any[]) => {
    setEditorValue(value.map((v) => serialize(v)).join(""));
  };

  return { editorValue, handleEditorChange };
}
export function DescendantToMarkdown(value: Descendant[]) {
  return value.map((v) => serialize(v)).join("");
}
export async function MarkdownToDescendant(value: string) {
  return deserialize(fromMarkdown(value).data);
  // const file = await unified()
  //   .use(remarkParse)
  //   // .use(remarkRehype)
  //   // .use(rehypeSanitize)
  //   // .use(rehypeStringify)
  //   .process(value);
  // console.log(String(file));
}
