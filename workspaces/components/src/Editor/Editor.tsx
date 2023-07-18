import { useMemo } from "react";
import { withReact, Slate } from "slate-react";
import { withHistory } from "slate-history";
import { Toolbar } from "./EditorComponents";
import { Box } from "@chakra-ui/react";
import { EditableComponent } from "./EditableComponent";

import { createEditor } from "slate";
import MarkButton from "./MarkButton";
import BlockButton from "./BlockButton";

import { Descendant } from "slate";
interface ParagraphElement {
  type: string;
  children: Descendant[];
}
interface MarkdownEditorProps {
  onChange: (value: Descendant[]) => void;
  value: Descendant[];
  minHeight?: string;
  initialValue?: ParagraphElement[];
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  onChange,
  placeholder,
  minHeight = "200",
  initialValue = [{ type: "paragraph", children: [{ text: "" }] }],
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Box position="relative">
      <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
        <Toolbar>
          <MarkButton format="bold" />
          <MarkButton format="italic" />
          <BlockButton format="heading-two" />
          <MarkButton format="underline" />
          <BlockButton format="bulleted-list" />
          <BlockButton format="numbered-list" />
        </Toolbar>
        <EditableComponent minHeight={minHeight} placeholder={placeholder} />
      </Slate>
    </Box>
  );
};
