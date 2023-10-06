import { Text } from "@chakra-ui/react";

const LinkBlock = ({ attributes, element, children }: any) => {
  const handleOnClick = () => {
    element.link && window.open(element.link, element.target);
  };

  return (
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
  );
};

export default LinkBlock;
