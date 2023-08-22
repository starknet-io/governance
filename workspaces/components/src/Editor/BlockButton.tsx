import { useSlate } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { Heading2Icon, BulletedListIcon, NumberedListIcon } from "src/Icons";
import { isBlockActive, toggleBlock } from "./hotkeys";
import { CustomParagraphTypes } from "./ElementLeaf";

type BlockButtonProps = {
  format: CustomParagraphTypes;
};

const ICONS: Partial<Record<CustomParagraphTypes, any>> = {
  heading_two: Heading2Icon,
  bulleted_list: BulletedListIcon,
  numbered_list: NumberedListIcon,
};

const BlockButton = ({ format }: BlockButtonProps) => {
  const editor = useSlate();
  const Icon = ICONS?.[format] ?? NumberedListIcon;
  return (
    <IconButton
      aria-label={format}
      size="tb"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={
        <Icon color={isBlockActive(editor, format) ? "white" : "#6F6E77"} />
      }
    />
  );
};

export default BlockButton;
