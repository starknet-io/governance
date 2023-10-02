import { Container, ContainerProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const HomeContainer = forwardRef(
  ({ children, ...rest }: ContainerProps, ref) => (
    <Container
      maxWidth={{
        base: "none",
        lg: "846px",
        xl: "1046px",
      }}
      px="32px"
      mx="auto"
      ref={ref}
      {...rest}
    >
      {children}
    </Container>
  ),
);

HomeContainer.displayName = "HomeContainer";
