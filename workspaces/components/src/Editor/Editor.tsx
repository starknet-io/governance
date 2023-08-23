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
  onChange,
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
        onChange={onChange}
      >
        {!hideTabBar && (
          <Toolbar>
            <MarkButton format="bold" />
            <MarkButton format="italic" />
            <MarkButton format="underline" />
            <MarkButton format="strikeThrough" />
            <BlockButton format="heading_one" />
            <BlockButton format="heading_two" />
            <BlockButton format="block_quote" />
            <BlockButton format="ul_list" />
            <BlockButton format="ol_list" />
            <ImageBlockButton editor={mainEditor} />
            <LinkBlockButton editor={mainEditor} />
          </Toolbar>
        )}
        <EditableComponent onPaste={handlePaste} minHeight={minHeight} />
      </Slate>
    </Box>
  );
};
