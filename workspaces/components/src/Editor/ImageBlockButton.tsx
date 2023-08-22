import { MouseEvent } from "react";
import { isBlockActive } from "./hotkeys";
import { ImageIcon } from "src/Icons";
import { IconButton } from "@chakra-ui/react";
import { Transforms } from "slate";

const ImageBlockButton = ({ editor, format }: any) => {
  const insertImageBlock = (url: string) => {
    if (!url) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "image",
        alt: "image",
        url,
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
      size="tb"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={handleEmbedImage}
      icon={
        <ImageIcon
          color={isBlockActive(editor, format) ? "white" : "#6F6E77"}
        />
      }
    />
  );
};

export default ImageBlockButton;
