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
  threshold?: number;
  children?: React.ReactNode;
};

export const Collapse = ({
  startingHeight = 20,
  threshold = 50,
  children,
}: Props) => {
  const [show, setShow] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [shouldRenderCollapse, setShouldRenderCollapse] = React.useState(false);

  const handleToggle = () => setShow(!show);

  React.useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.clientHeight - startingHeight > threshold
    ) {
      setShouldRenderCollapse(true);
    } else {
      setShouldRenderCollapse(false);
    }
  }, [startingHeight, children, threshold]);

  const effectiveStartingHeight = shouldRenderCollapse
    ? startingHeight
    : "100%";

  return (
    <>
      <ChakraCollapse
        startingHeight={effectiveStartingHeight}
        in={show}
        animateOpacity
      >
        <Box pb="32px" ref={contentRef}>
          {children}
        </Box>
      </ChakraCollapse>
      {shouldRenderCollapse && (
        <HStack
          position="relative"
          mt="-24px"
          spacing="0"
          h="80px"
          bgGradient="linear-gradient(to top,  #F9F8F9 55px, transparent)"
        >
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
      )}
    </>
  );
};
