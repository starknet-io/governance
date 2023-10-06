import { Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";
import React from "react";

type CustomTooltipProps = {
  label: string;
  children: React.ReactNode;
} & TooltipProps;

export const Tooltip = ({
  label,
  children,
  shouldWrapChildren = true,
  hasArrow = true,
  placement = "top",
  ...rest
}: CustomTooltipProps) => {
  return (
    <ChakraTooltip
      hasArrow={hasArrow}
      arrowShadowColor="transparent"
      bg="surface.accent.default"
      shouldWrapChildren={shouldWrapChildren}
      placement={placement}
      label={label}
      {...rest}
    >
      {children}
    </ChakraTooltip>
  );
};
