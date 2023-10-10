import {
  Select as CustomSelect,
  ChakraStylesConfig,
  Props,
} from "chakra-react-select";

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends Props {
  options: Option[];
  value?: string[];
  onChange: (values: string[]) => void;
}

export const Select = ({
  isInvalid = false,
  isReadOnly = false,
  isMulti = false,
  size,
  ...rest
}: SelectProps & { size?: "sm" | "md" }) => {
  const chakraStyles: ChakraStylesConfig = {
    container: (provided) => ({
      ...provided,
    }),

    valueContainer: (provided) => ({
      ...provided,

      paddingInlineStart: "8px",
      paddingInlineEnd: "8px",
    }),
    option: (provided, { isSelected }) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "20px",
      letterSpacing: "0.07px",
      fontFamily: "Inter Variable",
      ...(isSelected && {
        bg: "surface.forms.hover",
        color: "content-accent-default",
      }),
    }),
  };

  return (
    <CustomSelect
      chakraStyles={chakraStyles}
      isMulti={isMulti}
      size={size}
      tagVariant="select"
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      variant="primary"
      {...rest}
    />
  );
};
