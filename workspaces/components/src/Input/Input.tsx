import React, { forwardRef } from "react";
import {
  Input as ChakraInput,
  InputProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
} from "@chakra-ui/react";

type Props = {
  size?: "condensed" | "standard";
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
} & InputProps;

export const Input = forwardRef(
  (
    {
      type,
      size = "condensed",
      icon,
      placeholder,
      rightContent,
      ...rest
    }: Props,
    ref: any,
  ) => {
    if (icon && rightContent) {
      return (
        <InputGroup>
          <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
          <ChakraInput
            ref={ref}
            size={size}
            type={type}
            placeholder={placeholder}
            variant="primary"
            pl="40px"
            {...rest}
          />
          <InputRightElement>
            <Box pr="standard.sm">{rightContent}</Box>
          </InputRightElement>
        </InputGroup>
      );
    }
    if (icon) {
      return (
        <InputGroup>
          <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
          <ChakraInput
            ref={ref}
            size={size}
            type={type}
            placeholder={placeholder}
            variant="primary"
            {...rest}
          />
        </InputGroup>
      );
    }
    return (
      <ChakraInput
        ref={ref}
        variant="primary"
        size={size}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
