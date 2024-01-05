import { ChangeEvent, FC } from "react";
import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import { SearchIcon } from "../Icons";

// Define the props that the SearchInput component will accept
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  // Add other props as necessary...
}

// FC stands for Function Component. This is a generic type that takes a props argument.
export const SearchInput: FC<SearchInputProps> = ({
  placeholder = "Search by address or .eth", // default value
  value,
  onChange,
  // Destructure other props...
}) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Icon as={SearchIcon} color="muted" boxSize="5" />
      </InputLeftElement>
      <Input
        variant="primary"
        minWidth={{ base: "100%", md: "232px" }}
        height="36px"
        fontSize="13px"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        paddingLeft="calc(12px + 20px + 8px)"
        // Add other props...
      />
    </InputGroup>
  );
};
