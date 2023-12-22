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

export interface MultiselectProps extends Props {
  options: Option[];
  value?: string | Option | Option[];
  onChange: (newValue: unknown, actionMeta: ActionMeta<unknown>) => void;
  labels?: { [key: string]: string };
  variant?: "fill" | "outline";
}

export const Multiselect = ({
  isInvalid = false,
  isReadOnly = false,
  size,
  labels,
  value,
  variant,
  onChange,
  ...rest
}: MultiselectProps & { size?: "sm" | "md" }) => {
  const chakraStyles: ChakraStylesConfig = {
    control: (provided, state) => ({
      ...provided,
      padding: "8px 8px 8px 12px",
      alignItems: 'center',
      gap: '8px',
      alignSelf: 'stretch',
      borderRadius: '4px',
      border: '1px solid rgba(35, 25, 45, 0.10)',
      minHeight: state.selectProps.size === 'md' 
        ? '44px'
        : '36px',
      height: state.selectProps.size === 'md' 
        ? '44px'
        : '36px',
      background: '#FBFBFB',
      boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
      _hover: {
        background: state.selectProps.variant === "fill" ? 'surface.forms.default' : "surface.forms.hover",
        borderColor: "border.formsHover",
      },
      _active: {
        borderColor: "surface.accent.selected",
        boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
        "& input::placeholder": {
          color: "content.accent.default"
        }
      },
      _focusVisible: {
        background: state.selectProps.variant === "fill" ? 'surface.forms.default' : "surface.forms.hover",
        borderColor: "surface.accent.selected",
        boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
        "& input::placeholder": {
          color: "content.accent.default"
        }
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'content.support.default',
      _hover: {
        color: "content.support.hover"
      },
      _active: {
        color: "content.accent.default"
      },
    }),
    dropdownIndicator: (provided, state) => ({
      height: '20px !important',
      p: 0, // Reset padding to 0
      lineHeight: '1', // Remove padding to fit within the 44px height constraint
      // You might need to adjust the size of the svg icon here
      svg: {
        height: '20px', // Match the height of the control
        width: '20px',
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      height: "20px"
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: "0",
      height: "28px"
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
    onChange(
      selectedOptions.map((opt) => opt.value),
      actionMeta,
    );
  };

  return (
    <CustomSelect
      chakraStyles={chakraStyles}
      isMulti={true}
      size={size}
      tagVariant="select"
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      variant={variant}
      value={newValue}
      onChange={handleChange}
      {...rest}
    />
  );
};
