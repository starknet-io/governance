import {
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react";

export const IconButton = (props: IconButtonProps) => {
  return <ChakraIconButton {...props}>{props.children}</ChakraIconButton>;
};
