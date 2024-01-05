import {
  Box,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  StackProps,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { SearchIcon } from "../Icons";

type CheckboxFilterProps = Omit<CheckboxGroupProps, "onChange"> & {
  hideLabel?: boolean;
  options: Array<{ label: string; value: string; count?: number }>;
  label?: string;
  onChange?: (value: string[]) => void;
  spacing?: StackProps["spacing"];
  showSearch?: boolean;
};

export const CheckboxFilter = (props: CheckboxFilterProps) => {
  const {
    options,
    label,
    hideLabel,
    spacing = "2",
    showSearch,
    ...rest
  } = props;

  return (
    <Stack as="fieldset" spacing="standard.xs">
      {!hideLabel && (
        <FormLabel fontWeight="semibold" as="legend" mb="0">
          {label}
        </FormLabel>
      )}
      {showSearch && (
        <InputGroup size="md" pb="1">
          <Input
            placeholder="Search..."
            rounded="md"
            focusBorderColor={mode("blue.500", "blue.200")}
          />
          <InputRightElement
            pointerEvents="none"
            color="gray.400"
            fontSize="lg"
          >
            <SearchIcon />
          </InputRightElement>
        </InputGroup>
      )}
      <CheckboxGroup {...rest}>
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value} colorScheme="blue">
            <Box fontSize="14px">
              <span>{option.label}</span>
            </Box>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Stack>
  );
};
