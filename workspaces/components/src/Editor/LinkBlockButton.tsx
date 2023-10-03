import { MouseEvent } from "react";
import { isBlockActive } from "./hotkeys";
import { LinkIcon } from "src/Icons";
import { IconButton, useToken } from "@chakra-ui/react";
import { Editor, Transforms } from "slate";

const LinkBlockButton = ({ editor, format }: any) => {
  const [activeColor, inactiveColor] = useToken("colors", [
    "content.default.selectedInverted",
    "content.default.default",
  ]);
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

    const selectedText = Editor.string(editor, editor.selection);

    console.log({ selection: editor.selection, selectedText });
    // const linkName = prompt("Please enter link name");
    // const imgURL = prompt("Please enter a valid URL");
    const imgURL = "https://google.com";
    imgURL && selectedText && insertLinkBlock(imgURL, selectedText);
  };

  return (
    <IconButton
      aria-label={format}
      size="tb"
      variant="toolbar"
      isActive={isBlockActive(editor, format)}
      onMouseDown={handleInsertLink}
      height="100%"
      icon={
        <LinkIcon
          boxSize="20px"
          color={isBlockActive(editor, format) ? activeColor : inactiveColor}
        />
      }
    />
  );
};

export default LinkBlockButton;
