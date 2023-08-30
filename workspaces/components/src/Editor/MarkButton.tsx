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
      variant="ghost"
      isActive={isMarkActive(editor, format)}
      size="condensed"
      icon={
        format === "bold" ? (
          <BoldIcon
            boxSize="20px"
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "italic" ? (
          <ItalicIcon
            boxSize="20px"
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "underline" ? (
          <UnderlineIcon
            boxSize="20px"
            color={isMarkActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : (
          <UnderlineIcon
            boxSize="20px"
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
