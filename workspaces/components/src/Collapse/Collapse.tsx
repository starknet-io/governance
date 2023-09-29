import {
  Box,
  Collapse as ChakraCollapse,
  Divider,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { Button } from "src/Button";

type Props = {
  startingHeight?: number;
  children?: React.ReactNode;
};

export const Collapse = ({ startingHeight = 20, children }: Props) => {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);
  return (
    <>
      <ChakraCollapse startingHeight={"285px"} in={show} animateOpacity>
        <Box pb="32px">{children}</Box>
      </ChakraCollapse>
      <HStack position="relative" mt="-24px" spacing="0">
        <Divider />
        <Button
          minWidth="85px"
          variant="secondary"
          size="condensed"
          onClick={handleToggle}
        >
          View {show ? "Less" : "all"}
        </Button>
        <Divider />
      </HStack>
    </>
  );
};
