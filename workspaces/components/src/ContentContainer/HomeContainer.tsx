import { Container, ContainerProps } from "@chakra-ui/react";

export const HomeContainer = ({ children, ...rest }: ContainerProps) => (
  <Container
    maxWidth={{
      base: "none",
      lg: "846px",
      xl: "1240px",
    }}
    px="32px"
    mx="auto"
    {...rest}
  >
    {children}
  </Container>
);
