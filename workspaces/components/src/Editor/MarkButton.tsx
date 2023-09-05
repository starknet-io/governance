import { useSlate } from "slate-react";
import { IconButton, useToken } from "@chakra-ui/react";
import {
  BoldIcon,
  ItalicIcon,
  StrikeThroughIcon,
  UnderlineIcon,
} from "../Icons/ToolbarIcons";
import { isMarkActive, toggleMark } from "./hotkeys";

type MarkButtonTypes = "bold" | "italic" | "underline" | "strikeThrough";

type MarkButtonProps = {
  format: MarkButtonTypes;
};

const ICONS: Record<Partial<MarkButtonTypes>, any> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikeThrough: StrikeThroughIcon,
};

const MarkButton = ({ format }: MarkButtonProps) => {
  const editor = useSlate();
  const Icon = ICONS?.[format] ?? UnderlineIcon;
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);
  return (
    <IconButton
      aria-label={format}
      variant="ghost"
      isActive={isMarkActive(editor, format)}
      size="condensed"
      icon={
        <Icon
          boxSize="20px"
          color={isMarkActive(editor, format) ? activeColor : inactiveColor}
        />
      }
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    />
  );
};

export default MarkButton;
