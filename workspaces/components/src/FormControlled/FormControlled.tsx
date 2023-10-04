import React, { ReactNode, InputHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  Text,
  FormHelperText,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";

type CustomFormControlProps = {
  label: string;
  isRequired?: boolean;
  isError?: boolean;
  helperText?: string;
  errorMessage?: string | null;
  children: ReactNode;
} & Omit<ChakraInputProps, "children">;

export const FormControlled: React.FC<CustomFormControlProps> = ({
  label,
  isRequired = false,
  isError = false,
  helperText = "",
  errorMessage = "",
  children,
  ...otherProps
}) => {
  console.log("Is there an error?", isError);
  return (
    <FormControl isInvalid={isError} isRequired={isRequired}>
      <FormLabel
        sx={{
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "600",
          lineHeight: "20px",
          letterSpacing: "0.07px",
          display: "flex",
          gap: "standard.base",
        }}
      >
        {label}
        {isRequired && <Text color="content.support.default">(required)</Text>}
      </FormLabel>
      {children
        ? React.cloneElement(children as React.ReactElement, otherProps)
        : null}
      {!isError ? (
        <FormHelperText
          sx={{
            mt: "standard.xs",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "20px",
            letterSpacing: "0.12px",
          }}
          color="content.support.default"
        >
          {helperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage display={"flex"} gap="4px" mt="standard.xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.88533 2.75C5.73114 2.75 5.5825 2.81149 5.473 2.921L2.921 5.473C2.81149 5.5825 2.75 5.73114 2.75 5.88533V10.1147C2.75 10.2689 2.81149 10.4175 2.921 10.527L5.473 13.079C5.5825 13.1885 5.73114 13.25 5.88533 13.25H10.356L13.0789 10.5264L13.079 10.5263C13.1885 10.4168 13.25 10.2682 13.25 10.114V5.88533C13.25 5.73124 13.1886 5.58298 13.079 5.4737L13.0783 5.473L10.5263 2.921C10.4168 2.81149 10.2682 2.75 10.114 2.75H5.88533ZM4.41234 1.86034C4.80283 1.46984 5.33286 1.25 5.88533 1.25H10.114C10.6665 1.25 11.1965 1.46984 11.587 1.86034L14.1383 4.41163L14.1388 4.41215C14.5302 4.80282 14.75 5.333 14.75 5.88533V10.114C14.75 10.6664 14.5302 11.1964 14.1397 11.5869L14.1397 11.587L11.1971 14.5303C11.0564 14.671 10.8656 14.75 10.6667 14.75H5.88533C5.33286 14.75 4.80283 14.5302 4.41234 14.1397L1.86034 11.5877C1.46984 11.1972 1.25 10.6671 1.25 10.1147V5.88533C1.25 5.33286 1.46984 4.80283 1.86034 4.41234L4.41234 1.86034ZM8 4.25C8.41421 4.25 8.75 4.58579 8.75 5V8.33333C8.75 8.74755 8.41421 9.08333 8 9.08333C7.58579 9.08333 7.25 8.74755 7.25 8.33333V5C7.25 4.58579 7.58579 4.25 8 4.25ZM8.75 10.6667C8.75 10.2525 8.41421 9.91667 8 9.91667C7.58579 9.91667 7.25 10.2525 7.25 10.6667V10.7333C7.25 11.1475 7.58579 11.4833 8 11.4833C8.41421 11.4833 8.75 11.1475 8.75 10.7333V10.6667Z"
              fill="#E4442F"
            />
          </svg>
          {errorMessage}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

// import React, { Ref } from "react";
// import {
//   FormControl,
//   FormLabel,
//   FormHelperText,
//   FormErrorMessage,
//   FormControlProps,
//   FormLabelProps,
// } from "@chakra-ui/react";

// interface FormControlledProps extends FormControlProps {
//   component: React.ElementType;
//   name: string;
//   label?: string;
//   helperText?: string;
//   isError?: boolean;
//   errorMessage?: string;
//   formLabelProps?: FormLabelProps;
//   ref?: Ref<any>;
// }

// export const FormControlled: React.FC<FormControlledProps> = ({
//   component: Component,
//   name,
//   label,
//   helperText,
//   isError,
//   errorMessage,
//   formLabelProps,
//   ...restProps
// }) => {
//   const { onChange, onBlur, ref, placeholder, variant, ...otherRest } =
//     restProps;
//   console.log("Props to be passed to Component:", {
//     name,
//     onChange,
//     onBlur,
//     ref,
//   });
//   return (
//     <FormControl isInvalid={isError} {...otherRest}>
//       {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}

//       <Component
//         name={name}
//         onChange={onChange}
//         onBlur={onBlur}
//         ref={ref}
//         placeholder={placeholder}
//         variant={variant}
//         {...otherRest}
//       />

//       {!isError
//         ? helperText && <FormHelperText>{helperText}</FormHelperText>
//         : errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
//     </FormControl>
//   );
// };
