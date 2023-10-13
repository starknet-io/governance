import { Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PageContext } from "../../renderer/types";
import { DynamicCustomWidget } from "src/components/DynamicCustomWidget";

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
    <Box>
      <Box display={{ base: "flex" }} p="standard.md" justifyContent="flex-end">
        {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
      </Box>

      {children}
    </Box>
  );
};
