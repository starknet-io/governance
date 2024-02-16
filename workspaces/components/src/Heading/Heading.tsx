import { forwardRef } from "react";
import { Heading as ChakraHeading, HeadingProps } from "@chakra-ui/react";
import { headingTheme } from "./HeadingStyles";

type CustomHeadingProps = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & HeadingProps;

export const Heading = forwardRef<HTMLHeadingElement, CustomHeadingProps>(
  ({ variant, as, ...props }, ref) => {
    const { ...rest } = props;
    const Tag = variant || "h2";
    return (
      <ChakraHeading
        {...headingTheme[Tag as keyof typeof headingTheme]}
        as={variant as typeof as}
        ref={ref}
        {...rest}
      />
    );
  }
);

Heading.displayName = "Heading";