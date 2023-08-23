import { useSlate } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "..";
import { isMarkActive, toggleMark } from "./hotkeys";

type MarkButtonTypes = "bold" | "italic" | "underline" | "line_through";

type MarkButtonProps = {
  format: MarkButtonTypes;
};

const ICONS: Record<Partial<MarkButtonTypes>, any> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  line_through: () => <div style={{ textDecoration: 'line-through' }}>U</div>,
};

const MarkButton = ({ format }: MarkButtonProps) => {
  const editor = useSlate();
  const Icon = ICONS?.[format] ?? UnderlineIcon;
  return (
    <IconButton
      aria-label={format}
      variant="toolbar"
      isActive={isMarkActive(editor, format)}
      size="tb"
      icon={<Icon color={isMarkActive(editor, format) ? "white" : "#6F6E77"} />}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    />
  );
};

export default MarkButton;
