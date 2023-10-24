import { Box, IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import React from "react";
import { BellIcon } from "../Icons";

type DropdownProps = {
  children: React.ReactNode;
};
export const NotificationsMenu = ({ children }: DropdownProps) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu>
        <MenuButton
          width="36px"
          height="36px"
          as={IconButton}
          icon={<BellIcon boxSize="36px" />}
          variant="ghost"
          size="lg"
        />

        <Box top="0px" position="relative">
          <MenuList maxH="400px" overflowY="scroll">
            {children}
          </MenuList>
        </Box>
      </Menu>
    </Box>
  );
};
