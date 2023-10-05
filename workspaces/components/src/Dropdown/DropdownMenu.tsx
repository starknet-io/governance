import { Box, IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import React from "react";
import { EllipsisIcon } from "../Icons";

type DropdownProps = {
  children: React.ReactNode;
};
export const Dropdown = ({ children }: DropdownProps) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu>
        <MenuButton as={IconButton} icon={<EllipsisIcon />} variant="ghost" />

        <Box top="0px" position="relative">
          <MenuList>{children}</MenuList>
        </Box>
      </Menu>
    </Box>
  );
};
