import { Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageContext } from "../../renderer/types";
import { DynamicCustomWidget } from "#src/components/DynamicCustomWidget";

export interface Props {
  readonly pageContext: PageContext;
  readonly children: React.ReactNode;
}

export const LayoutOnboarding = ({ pageContext, children }: Props) => {
  const [renderDone, setRenderDone] = useState(false);
  useEffect(() => {
    setRenderDone(true);
  }, []);
  return (
    <Box height="100%">
      <Box
        position="sticky"
        top="0"
        bg="surface.bgPage"
        zIndex={100}
        borderBottom="1px solid"
        borderColor="border.forms"
        height={{ base: "60px", md: "68px" }}
        pl={{
          base: "standard.xs",
          md: "standard.md",
        }}
        pr={{
          base: "standard.md",
          md: "standard.xl",
        }}
        py={{
          base: "standard.sm",
          md: "standard.sm",
          lg: "standard.md",
        }}
        display={{ base: "flex" }}
        justifyContent="flex-end"
      >
        {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
      </Box>

      {children}
    </Box>
  );
};
