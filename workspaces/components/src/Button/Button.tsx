import { ButtonProps, Button as ChakraButton, Box } from "@chakra-ui/react";
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
    | "textSmall"
    | "learnNavLink"
    | "fill";
  children: React.ReactNode;
  toId?: string;
  href?: string;
  isExternal?: boolean;
  target?: ButtonProps["formTarget"];
  disabled?: boolean;
} & ButtonProps;

export const Button = forwardRef<HTMLButtonElement, props>(
  ({ children, toId, href, disabled = false, variant, ...rest }, ref) => {
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
        variant={variant}
        {...rest}
        sx={{
          "& > .gradient-border": {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "4px",
            overflow: "hidden",
            "&::before": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: `linear-gradient(
              to left,
              #F09280 0%,
              #E87888 33%,
              #D672EF 66%,
              #BCA1F3 100%
            )`,
              borderRadius: "4px",
              padding: "2px",
            },
            "&::after": {
              content: `""`,
              position: "absolute",
              top: "2px",
              right: "2px",
              bottom: "2px",
              left: "2px",
              background: "white",
              borderRadius: "4px",
              color: "content.default.default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
        }}
      >
        {variant === "fill" ? (
          <>
            <div className="gradient-border" />
            <Box zIndex={1}>{children}</Box>
          </>
        ) : (
          children
        )}
      </ChakraButton>
    );
  },
);

Button.displayName = "Button";
