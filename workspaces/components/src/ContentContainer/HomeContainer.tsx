import { Container, ContainerProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const HomeContainer = forwardRef(
  ({ children, ...rest }: ContainerProps, ref) => (
    <Container maxWidth="1240px" px="32px" mx="auto" ref={ref} {...rest}>
      {children}
    </Container>
  ),
);

HomeContainer.displayName = "HomeContainer";
