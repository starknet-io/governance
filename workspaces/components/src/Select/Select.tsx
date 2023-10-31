import {
  Select as CustomSelect,
  ChakraStylesConfig,
  Props,
  ActionMeta,
} from "chakra-react-select";

interface Option {
  value: string;
  label?: string;
}

export interface SelectProps extends Props {
  options: Option[];
  value?: string | Option | Option[];
  onChange: (newValue: unknown, actionMeta: ActionMeta<unknown>) => void;
  labels?: { [key: string]: string };
}

export const Select = ({
  isInvalid = false,
  isReadOnly = false,
  isMulti = false,
  size,
  labels,
  value,
  onChange,
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
    menuList: (provided) => ({
      ...provided,
      minWidth: "240px",
      rowGap: 1,
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

  const normalizeValue = (val: string | Option | Option[]): Option[] => {
    if (!val) return [];
    if (typeof val === "string")
      return [{ value: val, label: labels?.[val] ?? val }];
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
      return val.map((v) => ({ value: v, label: labels?.[v] ?? v }));
    }
    return val as Option[];
  };

  const newValue = normalizeValue(value);

  const handleChange = (
    selectedOptions: Option[],
    actionMeta: ActionMeta<unknown>,
  ) => {
    if (isMulti) {
      onChange(
        selectedOptions.map((opt) => opt.value),
        actionMeta,
      );
    } else {
      onChange(selectedOptions[0]?.value, actionMeta);
    }
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
      value={newValue}
      onChange={handleChange}
      {...rest}
    />
  );
};
