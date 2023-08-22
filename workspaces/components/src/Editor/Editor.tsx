import { useMemo, ClipboardEvent } from "react";
import { withReact, Slate } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./EditorComponents";
import { Box } from "@chakra-ui/react";
import { EditableComponent } from "./EditableComponent";
import { MarkdownEditorProps } from "./MarkdownEditorProps";
import { initialValue } from "./initialValue";
import { createEditor } from "slate";
import MarkButton from "./MarkButton";
import BlockButton from "./BlockButton";
import { useMarkdownEditor } from "./useMarkdownEditor";
import ImageBlockButton from "./ImageBlockButton";
import LinkBlockButton from "./LinkBlockButton";

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  minHeight = "200",
  customEditor,
  hideTabBar = false,
}) => {
  const { convertMarkdownToSlate } = useMarkdownEditor("");
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.clipboardData?.getData("Text") ?? "";
    const mainEditor = customEditor ?? editor;
    const markdown = await convertMarkdownToSlate(data);
    mainEditor?.insertNodes(markdown);
  };

  const mainEditor = customEditor || editor;

  return (
    <Box position="relative">
      <Slate
        editor={mainEditor}
        initialValue={customEditor ? [] : initialValue}
        onChange={(value) => console.log({ value })}
      >
        {!hideTabBar && (
          <Toolbar>
            <MarkButton format="bold" />
            <MarkButton format="italic" />
            <MarkButton format="underline" />
            <BlockButton format="heading_two" />
            <BlockButton format="bulleted_list" />
            <BlockButton format="numbered_list" />
            <ImageBlockButton editor={mainEditor} />
            <LinkBlockButton editor={mainEditor} />
          </Toolbar>
        )}
        <EditableComponent onPaste={handlePaste} minHeight={minHeight} />
      </Slate>
    </Box>
  );
};
