import {
  Badge,
  Box,
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import React from "react";

export const IconButton = React.forwardRef(
  ({ ...rest }: IconButtonProps, ref) => (
    <ChakraIconButton ref={ref} {...rest} />
  ),
);

IconButton.displayName = "IconButton";

export const IconButtonWithBadge = React.forwardRef(
  (
    {
      badgeContent = 1,
      size,
      ...rest
    }: IconButtonProps & { badgeContent: React.ReactNode },
    ref,
  ) => (
    <Box position="relative" display="flex">
      <IconButton
        paddingRight={`${badgeContent !== 0 ? "40px" : "standard.md"}`}
        ref={ref}
        {...rest}
        size={size}
        width="36px"
      />
      {badgeContent !== 0 && (
        <Badge
          position={"absolute"}
          top="9px"
          size="iconButtonBadge"
          right="8px"
          variant="stagnant"
          zIndex={1}
          pointerEvents="none"
        >
          {badgeContent}
        </Badge>
      )}
    </Box>
  ),
);

IconButtonWithBadge.displayName = "IconButtonWithBadge";
