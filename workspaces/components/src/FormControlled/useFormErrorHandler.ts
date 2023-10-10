import { useRef, useCallback } from "react";

type ErrorRefs = {
  [key: string]: HTMLElement | null;
};

type Errors = {
  [key: string]: any; // Replace 'any' with the shape of your error if you have one defined
};

export function useFormErrorHandler() {
  const refs = useRef<ErrorRefs>({});
  const setErrorRef = useCallback((name: string, ref: HTMLElement | null) => {
    refs.current[name] = ref;
  }, []);

  const scrollToError = useCallback((errors: Errors) => {
    console.log("scrollToEnter");
    const firstErrorKey = Object.keys(errors)[0];
    console.log("firstErrorKey:", firstErrorKey);
    console.log("refs.current:", refs.current);
    refs.current[firstErrorKey]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return { setErrorRef, scrollToError };
}
