import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "#src/Icons";

type props = {
  children: React.ReactNode;
  isExternal?: boolean;
  hasArrow?: boolean;
} & LinkProps;

export const Link = ({
  children,
  isExternal,
  hasArrow = true,
  ...rest
}: props) => {
  return (
    <ChakraLink {...rest} target={isExternal ? "_blank" : "_top"}>
      {children}
      {isExternal && hasArrow && <ExternalLinkIcon ml="2px" fontSize="14px" mb="1px" />}
    </ChakraLink>
  );
};
