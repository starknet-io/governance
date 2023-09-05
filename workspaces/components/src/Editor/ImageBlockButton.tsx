import { MouseEvent } from "react";
import { isBlockActive } from "./hotkeys";
import { ImageIcon } from "src/Icons";
import { IconButton, useToken } from "@chakra-ui/react";
import { Transforms } from "slate";

const ImageBlockButton = ({ editor, format }: any) => {
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);
  const insertImageBlock = (link: string) => {
    if (!link) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "image",
        caption: "image",
        link,
        children: [{ text: "" }],
      },
      { select: true },
    );
    Transforms.insertNodes(editor, {
      //@ts-expect-error error
      type: "paragraph",
      children: [{ text: "" }],
    });
  };

  const handleEmbedImage = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    const imgURL = prompt("Please enter a valid image URL");
    imgURL && insertImageBlock(imgURL);
  };

  return (
    <IconButton
      aria-label={format}
      size="condensed"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={handleEmbedImage}
      icon={
        <ImageIcon
          boxSize="18px"
          color={isBlockActive(editor, format) ? activeColor : inactiveColor}
        />
      }
    />
  );
};

export default ImageBlockButton;
