import { useRef, useCallback } from "react";

type ErrorRefs = {
  [key: string]: HTMLElement | null;
};

type Errors = {
  [key: string]: any;
};

export function useFormErrorHandler() {
  const refs = useRef<ErrorRefs>({});
  const setErrorRef = useCallback((name: string, ref: HTMLElement | null) => {
    refs.current[name] = ref;
  }, []);

  const scrollToError = useCallback((errors: Errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    refs.current[firstErrorKey]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return { setErrorRef, scrollToError };
}
