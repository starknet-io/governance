import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface MultiselectProps {
  options: Option[];
  value?: string[];
  onChange: (values: string[]) => void;
}

export const Multiselect: React.FC<MultiselectProps> = ({
  options,
  value = [],
  onChange,
}) => {
  const handleChange = (selected: readonly Option[] | null) => {
    const selectedValues = selected
      ? selected.map((option) => option.value)
      : [];
    onChange(selectedValues);
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  return (
    <Select
      options={options}
      isMulti
      classNamePrefix="select"
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Select option"
    />
  );
};
