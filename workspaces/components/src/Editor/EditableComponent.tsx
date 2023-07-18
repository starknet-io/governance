import { Editable } from "slate-react";
import { useSlate } from "slate-react";
import { useCallback } from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";

import { Element, Leaf } from "./ElementLeaf";
import { toggleMark, HOTKEYS } from "./hotkeys";
import isHotkey from "is-hotkey";

interface EditableComponentProps {
  minHeight?: string;
  autoFocus?: boolean;
  placeholder?: string;
}

export const EditableComponent = ({
  minHeight,
  autoFocus = false,
  placeholder,
}: EditableComponentProps) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const editor = useSlate();

  return (
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder}
      spellCheck
      autoFocus={autoFocus}
      onKeyDown={(event) => {
        for (const hotkey in HOTKEYS) {
          if (isHotkey(hotkey, event as any)) {
            event.preventDefault();
            const mark = HOTKEYS[hotkey];
            toggleMark(editor, mark);
          }
        }
      }}
      style={{
        backgroundColor: "#fff",
        padding: "12px",
        paddingBottom: "44px",
        borderRadius: "4px",
        boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        fontSize: "14px",
        minHeight: `${minHeight}px`,
      }}
    />
  );
};
