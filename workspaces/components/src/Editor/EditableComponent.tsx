import { useState } from "react";
import { Editable } from "slate-react";
import { useSlate } from "slate-react";
import { useCallback, ClipboardEvent } from "react";
import { RenderElementProps, RenderLeafProps, ReactEditor } from "slate-react";
import { Editor, Transforms, Range, Element as SlateElement, Path } from 'slate';
import { Element, Leaf } from "./ElementLeaf";
import { toggleMark, HOTKEYS } from "./hotkeys";
import isHotkey from "is-hotkey";
import "./EditableComponent.css";

interface EditableComponentProps
  extends React.TextareaHTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  minHeight?: string;
  autoFocus?: boolean;
  offsetPlaceholder?: string;
  onPaste?: (event: ClipboardEvent<HTMLDivElement>) => void;
  isInvalid?: boolean;
}

export const EditableComponent = ({
  minHeight,
  autoFocus = false,
  onPaste,
  offsetPlaceholder = "12px",
  placeholder,
  isInvalid = false,
}: EditableComponentProps) => {
  const editor = useSlate();
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element editor={editor} {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );
  const [isFocused, setIsFocused] = useState(false);
  const styleObj = {
    overflowY: "scroll",
    maxHeight: "500px",
    backgroundColor: "#FBFBFB",
    padding: "12px",
    paddingBottom: "44px",
    borderRadius: "4px",
    boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
    border: "1px solid ",
    borderColor: "rgba(35, 25, 45, 0.10)",
    fontSize: "14px",
    minHeight: `${minHeight}px`,
    outline: `1px solid ${isInvalid ? "#E53E3E" : "transparent"}`,
    "--slate-placeholder-margin-top": offsetPlaceholder,
  };
  return (
    <Editable
      className={isFocused ? "editableComponent" : "editableComponent"}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      autoFocus={autoFocus}
      onPaste={onPaste}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const match = Editor.above(editor, {
            match: n => Editor.isBlock(editor, n),
          })
      
          if (match) {
            const [node, path] = match
            if (SlateElement.isElement(node) && node.type === 'list_item' && Range.isCollapsed(editor.selection)) {
              if (Editor.string(editor, path) === '') {
                const parent = Editor.parent(editor, path);
                if (parent[0].children.length === 1) {
                  Transforms.removeNodes(editor, { at: parent[1] });
                  const paragraph = { type: 'paragraph', children: [{ text: '' }] };
                  Transforms.insertNodes(editor, paragraph);
                } else {
                  Transforms.setNodes(editor, { type: 'paragraph' }, { at: path })
                  Transforms.liftNodes(editor, { match: n => n.type === 'paragraph' });
                }
                return
              }
            }
          }
          editor.insertBreak();
        }
        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event as any)) {
            event.preventDefault();
            const mark = HOTKEYS[hotkey];
            toggleMark(editor, mark);
          }
        }
      }}
      style={styleObj}
    />
  );
};
