import React, { forwardRef } from "react";
import { Tabs as ChakraTabs, TabList, useTab } from "@chakra-ui/react";
import { Button } from "../Button";

type Props = {
  tabs: {
    label: string;
    value: string;
  }[];
};
export const Tabs = ({ tabs }: Props) => {
  const CustomTab = forwardRef((props, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];

    // 2. Hook into the Tabs `size`, `variant`, props
    return (
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        w="100%"
        borderRadius="30px"
      >
        {tabProps.children}
      </Button>
    );
  });

  return (
    <ChakraTabs
      variant="soft-rounded"
      colorScheme="#e8e7e9"
      w="100%"
      p="6px"
      border="1px solid"
      borderColor="border.dividers"
      borderRadius="30px"
    >
      <TabList>
        <CustomTab>Tab 1</CustomTab>
        <CustomTab>Tab 2</CustomTab>
      </TabList>
    </ChakraTabs>
  );
};

export default Tabs;
