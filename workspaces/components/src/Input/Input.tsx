import {
  Input as ChakraInput,
  InputProps,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

type Props = {
  size?: "condensed" | "standard";
  icon?: React.ReactNode;
} & InputProps;

export const Input = ({
  type,
  size = "condensed",
  icon,
  placeholder,
  ...rest
}: Props) => {
  if (icon) {
    return (
      <InputGroup>
        <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        <ChakraInput
          size={size}
          {...rest}
          type={type}
          placeholder={placeholder}
          variant="primary"
        />
      </InputGroup>
    );
  }
  return (
    <ChakraInput
      variant="primary"
      size={size}
      {...rest}
      type={type}
      placeholder={placeholder}
    />
  );
};
