import { MouseEvent } from "react";
import { isBlockActive } from "./hotkeys";
import { LinkIcon } from "src/Icons";
import { IconButton } from "@chakra-ui/react";
import { Transforms } from "slate";

const LinkBlockButton = ({ editor, format }: any) => {
  const insertLinkBlock = (link: string, linkName: string) => {
    if (!link) return;

    Transforms.insertNodes(
      editor,
      {
        //@ts-expect-error error
        type: "link",
        link,
        target: "_blank",
        children: [{ text: ` ${linkName}` }],
      },
      { select: true },
    );
    Transforms.insertNodes(editor, {
      //@ts-expect-error error
      type: "paragraph",
      children: [{ text: "" }],
    });
  };

  const handleInsertLink = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault();
    const linkName = prompt("Please enter link name")
    const imgURL = prompt("Please enter a valid URL");
    imgURL && linkName && insertLinkBlock(imgURL, linkName);
  };

  return (
    <IconButton
      aria-label={format}
      size="tb"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={handleInsertLink}
      icon={
        <LinkIcon color={isBlockActive(editor, format) ? "white" : "#6F6E77"} />
      }
    />
  );
};

export default LinkBlockButton;
