import { useRef, useCallback } from "react";

type ErrorRefs = {
  [key: string]: HTMLElement | null;
};

type Errors = {
  [key: string]: any;
};

export function useFormErrorHandler(fieldOrder: string[]) {
  const refs = useRef<ErrorRefs>({});

  const setErrorRef = useCallback((name: string, ref: HTMLElement | null) => {
    refs.current[name] = ref;
  }, []);

  const getFirstErrorField = (errors: Errors): string | null => {
    for (const field of fieldOrder) {
      if (errors[field]) {
        return field;
      }
    }
    return null;
  };

  const scrollToError = useCallback(
    (errors: Errors) => {
      const firstErrorField = getFirstErrorField(errors);
      if (firstErrorField) {
        refs.current[firstErrorField]?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [fieldOrder],
  );

  return { setErrorRef, scrollToError };
}
