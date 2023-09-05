import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { ExternalLinkIcon } from "src/Icons";

type props = {
  children: React.ReactNode;
  isExternal?: boolean;
} & LinkProps;

export const Link = ({ children, isExternal, ...rest }: props) => {
  return (
    <ChakraLink {...rest} target={isExternal ? "_blank" : "_top"}>
      {children}
      {isExternal && <ExternalLinkIcon ml="2px" />}
    </ChakraLink>
  );
};
