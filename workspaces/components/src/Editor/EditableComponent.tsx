import { useState } from "react";
import { Editable } from "slate-react";
import { useSlate } from "slate-react";
import { useCallback, ClipboardEvent } from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";

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
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const editor = useSlate();
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

    // Adjust outline based on focus state
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
      onFocus={() => setIsFocused(true)} // Set focus state to true
      onBlur={() => setIsFocused(false)} // Set focus state to false
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
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
