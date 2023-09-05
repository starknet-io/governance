import { useSlate } from "slate-react";
import { IconButton, useToken } from "@chakra-ui/react";
import { Heading2Icon, BulletedListIcon, NumberedListIcon } from "src/Icons";
import { isBlockActive, toggleBlock } from "./hotkeys";
import { CustomParagraphTypes } from "./ElementLeaf";
import { StrikeThroughIcon } from "src/Icons/ToolbarIcons";

type BlockButtonProps = {
  format: CustomParagraphTypes;
};

const ICONS: Partial<Record<CustomParagraphTypes, any>> = {
  heading_two: Heading2Icon,
  ul_list: BulletedListIcon,
  ol_list: NumberedListIcon,
  heading_one: Heading2Icon,
  block_quote: StrikeThroughIcon,
};

const BlockButton = ({ format }: BlockButtonProps) => {
  const editor = useSlate();
  const Icon = ICONS?.[format] ?? NumberedListIcon;
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);
  return (
    <IconButton
      aria-label={format}
      size="condensed"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={
        <Icon
          boxSize="20px"
          color={isBlockActive(editor, format) ? activeColor : inactiveColor}
        />
      }
    />
  );
};

export default BlockButton;
