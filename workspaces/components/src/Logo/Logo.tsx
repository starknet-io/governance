import { Flex } from "@chakra-ui/react";
import { Heading } from "src/Heading";

export const Logo = () => {
  return (
    <Flex
      as="a"
      href="/"
      gap="8px"
      height="88px"
      mt="-34px"
      display="flex"
      alignItems="center"
      paddingLeft="8px"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 8.24225L15.7578 2L12 5.75774L8.24224 2L2 8.24225L5.75776 12L2 15.7578L8.24224 22L12 18.2422L15.7578 22L22 15.7578L18.2422 12L22 8.24225Z"
          fill="#33333E"
        />
      </svg>
      <Heading variant="h5">Starknet </Heading>
    </Flex>
  );
};
