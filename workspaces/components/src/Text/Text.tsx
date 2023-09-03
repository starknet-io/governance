import { Text as ChakraText, TextProps } from "@chakra-ui/react";

export interface LocalTextProps extends TextProps {
  variant?:
    | "cardBody"
    | "body"
    | "breadcrumbs"
    | "footerLink"
    | "small"
    | "smallStrong"
    | "medium"
    | "mediumStrong"
    | "large"
    | "largeStrong"
    | "captionSmall"
    | "captionSmallStrong"
    | "captionSmallUppercase";
}

export const Text = ({ variant, children, ...rest }: LocalTextProps) => {
  return (
    <ChakraText variant={variant} {...rest}>
      {children}
    </ChakraText>
  );
};
