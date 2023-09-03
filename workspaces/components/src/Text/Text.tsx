import { Text as ChakraText, TextProps } from "@chakra-ui/react";

export type Props = {
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
} & TextProps;

export const Text = ({ variant, children, ...rest }: Props) => {
  return (
    <ChakraText variant={variant} {...rest}>
      {children}
    </ChakraText>
  );
};
