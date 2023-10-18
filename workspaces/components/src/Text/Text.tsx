import React from "react";
import { Text as ChakraText, TextProps } from "@chakra-ui/react";

export interface LocalTextProps extends TextProps {
  variant?:
    | "cardBody"
    | "body"
    | "bodySmall"
    | "bodySmallStrong"
    | "bodyMedium"
    | "bodyMediumStrong"
    | "bodyLargeSoft"
    | "bodyLargeStrong"
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

const TextComponent = (
  { variant, children, ...rest }: LocalTextProps,
  ref: React.Ref<any>,
) => {
  return (
    <ChakraText ref={ref} variant={variant} {...rest}>
      {children}
    </ChakraText>
  );
};

export const Text = React.forwardRef(TextComponent);
