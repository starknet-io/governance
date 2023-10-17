import { useSlate } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { Heading2Icon, BulletedListIcon, NumberedListIcon } from "src/Icons";
import { isBlockActive, toggleBlock } from "./hotkeys";
import { CustomParagraphTypes } from "./ElementLeaf";
import { BlockQuoteIcon } from "src/Icons/ToolbarIcons";

type BlockButtonProps = {
  format: CustomParagraphTypes;
};

const ICONS: Partial<Record<CustomParagraphTypes, any>> = {
  heading_two: Heading2Icon,
  ul_list: BulletedListIcon,
  ol_list: NumberedListIcon,
  heading_one: Heading2Icon,
  block_quote: BlockQuoteIcon,
};

const BlockButton = ({ format }: BlockButtonProps) => {
  const editor = useSlate();
  const Icon = ICONS?.[format] ?? NumberedListIcon;
  return (
    <IconButton
      aria-label={format}
      variant="ghost"
      size="condensed"
      isActive={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      icon={
        <Icon
          boxSize="20px"
        />
      }
    />
  );
};

export default BlockButton;
