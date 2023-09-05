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
    <Box position="relative">
      <IconButton ref={ref} {...rest} size={size} />
      <Badge
        size="round"
        position="absolute"
        top="50%"
        marginTop="-10px"
        right="8px"
        variant="amount"
        zIndex={1}
        pointerEvents="none"
      >
        {badgeContent}
      </Badge>
    </Box>
  ),
);

IconButtonWithBadge.displayName = "IconButtonWithBadge";
