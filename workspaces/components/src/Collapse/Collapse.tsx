import {
  Box,
  Collapse as ChakraCollapse,
  Divider,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { Button } from "..//Button";

type Props = {
  startingHeight?: number;
  threshold?: number;
  children?: React.ReactNode;
  height?: number;
};

export const Collapse = ({
  startingHeight = 20,
  threshold = 50,
  children,
  height = 60
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
          mt="-44px"
          spacing="0"
          h={height}
          bgGradient="linear-gradient(0deg, #F9F8F9 0%, rgba(249, 248, 249, 0.50) 100%)"
        >
          <Divider />
          <Button
            minWidth="85px"
            variant="secondary"
            size="standard"
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
