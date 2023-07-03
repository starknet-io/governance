import { useSlate } from "slate-react";
import { IconButton } from "@chakra-ui/react";
import { Heading2Icon, BulletedListIcon, NumberedListIcon } from "src/Icons";
import { isBlockActive, toggleBlock } from "./hotkeys";

type BlockButtonProps = {
  format: string;
};

const BlockButton = ({ format }: BlockButtonProps) => {
  const editor = useSlate();
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
        format === "heading-two" ? (
          <Heading2Icon
            color={isBlockActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "bulleted-list" ? (
          <BulletedListIcon
            color={isBlockActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : format === "numbered-list" ? (
          <NumberedListIcon
            color={isBlockActive(editor, format) ? "white" : "#6F6E77"}
          />
        ) : (
          <NumberedListIcon
            color={isBlockActive(editor, format) ? "white" : "#6F6E77"}
          />
        )
      }
    />
  );
};

export default BlockButton;
