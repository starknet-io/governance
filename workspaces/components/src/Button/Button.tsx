import { ButtonProps, Button as ChakraButton } from "@chakra-ui/react";
import { scrollIntoView } from "../utils/scrollIntoView";
import React, { forwardRef } from "react";

export type props = {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "special"
    | "textSmall";
  children: React.ReactNode;
  toId?: string;
  href?: string;
  isExternal?: boolean;
  target?: ButtonProps["formTarget"];
  disabled?: boolean;
} & ButtonProps;

export const Button = forwardRef<HTMLButtonElement, props>(
  ({ children, toId, href, disabled = false, ...rest }, ref) => {
    const handleOnClick = () => {
      if (!toId) {
        return;
      }

      scrollIntoView(toId);
    };

    return (
      <ChakraButton
        as={href != null ? "a" : undefined}
        onClick={handleOnClick}
        ref={ref}
        href={href}
        isDisabled={disabled}
        {...rest}
      >
        {children}
      </ChakraButton>
    );
  },
);

Button.displayName = "Button";
