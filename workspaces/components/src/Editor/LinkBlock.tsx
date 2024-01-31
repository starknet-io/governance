import { useState } from "react";
import { Text } from "@chakra-ui/react";
import LinkEditModal from "./LinkEditModal";

const LinkBlock = ({ editor, attributes, element, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOnClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault();
    setIsOpen(true);
  };
  return (
    <>
      <LinkEditModal
        editor={editor}
        url={element.link}
        selectedText={children}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <a
        href={element.link}
        {...attributes}
        {...element.attr}
        target={element.target}
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        <Text
          onClick={handleOnClick}
          as="span"
          fontWeight="medium"
          color="content.links.default"
        >
          {children}
        </Text>
      </a>
    </>
  );
};

export default LinkBlock;
