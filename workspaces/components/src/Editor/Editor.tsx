import { useMemo, ClipboardEvent } from "react";
import { withReact, Slate } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./EditorComponents";
import { Box, Divider } from "@chakra-ui/react";
import { EditableComponent } from "./EditableComponent";
import { MarkdownEditorProps } from "./MarkdownEditorProps";
import { defaultInitialValue } from "./initialValue";
import { Descendant, createEditor } from "slate";
import MarkButton from "./MarkButton";
import { useMarkdownEditor } from "./useMarkdownEditor";
import ImageBlockButton from "./ImageBlockButton";
import LinkBlockButton from "./LinkBlockButton";
import { TextTypeButton } from "./TextTypeButton";
import { MoreButton } from "./MoreButton";
import { withInlines } from "./hotkeys";

export const MarkdownEditor: React.FC<
  MarkdownEditorProps & {
    handleUpload?: (file: File) => Promise<string | void> | void;
    offsetPlaceholder?: string;
    isInvalid?: boolean;
    initialValue?: Descendant[];
  }
> = ({
  onChange,
  minHeight = "200",
  customEditor,
  hideTabBar = false,
  handleUpload,
  placeholder,
  offsetPlaceholder,
  basicEditor = false,
  isInvalid = false,
  initialValue = defaultInitialValue,
}) => {
  const { convertMarkdownToSlate } = useMarkdownEditor("");
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  const handlePaste = async (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.clipboardData?.getData("Text") ?? "";
    const mainEditor = customEditor ?? editor;
    const markdown = await convertMarkdownToSlate(` ${data}`);
    mainEditor?.insertNodes(markdown, {
      at: editor.selection?.focus,
    });
  };

  const mainEditor = customEditor || editor;

  if (!mainEditor) return;

  return (
    <Box position="relative">
      <Slate
        editor={mainEditor}
        initialValue={initialValue}
        onChange={onChange}
      >
        {!hideTabBar && (
          <Toolbar>
            <MarkButton format="bold" />
            <MarkButton format="italic" />
            {!basicEditor && (
              <>
                <TextTypeButton />
                <ImageBlockButton
                  editor={mainEditor}
                  handleUpload={handleUpload}
                />
                <LinkBlockButton editor={mainEditor} />
              </>
            )}
            <Divider ml="2" orientation="vertical" />
            <MoreButton />
          </Toolbar>
        )}
        <EditableComponent
          offsetPlaceholder={offsetPlaceholder}
          placeholder={placeholder}
          onPaste={handlePaste}
          minHeight={minHeight}
          isInvalid={isInvalid}
        />
      </Slate>
    </Box>
  );
};
