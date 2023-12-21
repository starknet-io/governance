import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from 'react-select';

interface Option {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: Option[]; // Ispravljen tip za options
  value?: string | number;
  onChange: (value: string | number) => void; // Ispravka tipa za onChange
  variant?: "fill" | "outline";
  placeholder?: string;
}

export const Select = ({
  options,
  value,
  variant,
  onChange,
  placeholder,
  ...props
}: SelectProps & { size?: "sm" | "md" }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(value);

  const wrapperRef = useRef(null); // Wrapper ref

  // Event handler za zatvaranje menija kada se klikne izvan komponente
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuIsOpen(false);
      }
    }

    // Dodajemo event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Čistimo event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (option: Option | null) => {
    const newValue = option ? option.value : '';
    onChange(newValue);
    if (value === undefined) {
      setInternalValue(newValue);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      padding: state.selectProps.size === 'md' 
      ? '12px 8px 12px 12px'
      : '8px 8px 8px 12px',
      alignItems: 'center',
      gap: '8px',
      alignSelf: 'stretch',
      borderRadius: '4px',
      border: '1px solid rgba(35, 25, 45, 0.10)',
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
      color: '#86848D',
      fontSize: "14px",
      fontDamily: "Inter",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "20px",
      letterSpacing: "0.07px",
      _hover: {
        color: "#1A1523"
      },
      _active: {
        color: "#1A1523"
      },
    }),
    dropdownIndicator: () => ({
      height: '20px !important',
      p: 0, // Reset padding to 0
      lineHeight: '1', // Remove padding to fit within the 44px height constraint
      // You might need to adjust the size of the svg icon here
      svg: {
        width: '12px', // Match the height of the control
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      height: "20px"
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: "20px",
      alignItems: "flex-start",
      padding: 0
    }),
    singleValue: (provided, state) => ({
      ...provided,
      height: "20px",
      margin: 0,
      fontSize: "14px",
      fontDamily: "Inter",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "20px",
      letterSpacing: "0.07px"
    }),
    input: (provided, state) => ({
      ...provided,
      display: "none"
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent"
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: "240px",
    }),
    menuList: (provided) => ({
      ...provided,
      minWidth: "240px",
      rowGap: 1,
      padding: "4px",
      backgroundColor: "#FBFBFB",
      borderRadius: "4px",
      border: "1px solid",
      borderColor: "rgba(35, 25, 45, 0.10)",
      boxShadow: "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)"
    }),
    option: (provided, { isSelected, isFocused }) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "20px",
      letterSpacing: "0.07px",
      fontFamily: "Inter Variable",
      display: "flex",
      padding: "8px",
      alignItems: "center",
      gap: "8px",
      alignSelf: "stretch",
      minHeight: "36px",
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "rgba(55, 22, 55, 0.03)",
      },
      _hover: {
        backgroundColor: "rgba(55, 22, 55, 0.03)",
      },
      ...((isSelected || isFocused ) && {
        backgroundColor: "rgba(55, 22, 55, 0.03)",
        color: "#1A1523"
      }),
    }),
  }
  const selectedOption = options.find(option => option.value === internalValue);

  return (
    <div ref={wrapperRef}>
      <CustomSelect
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuIsOpen={menuIsOpen}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        {...props} 
      />
    </div>
  );
};