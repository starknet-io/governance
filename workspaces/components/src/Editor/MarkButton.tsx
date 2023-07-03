import { useSlate } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "..";
import { isMarkActive, toggleMark } from "./hotkeys";

type MarkButtonProps = {
  format: string;
};

const MarkButton = ({ format }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      aria-label={format}
      variant="toolbar"
      isActive={isMarkActive(editor, format)}
      size="tb"
      icon={
        format === "bold" ? (
          <BoldIcon
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "italic" ? (
          <ItalicIcon
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "underline" ? (
          <UnderlineIcon
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : (
          <UnderlineIcon
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        )
      }
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    />
  );
};

export default MarkButton;
