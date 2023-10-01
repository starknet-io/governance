import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { EllipsisIcon } from "src/Icons";

type DropdownProps = {
  children: React.ReactNode;
  buttonIcon?: React.ReactElement;
  buttonVariant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  buttonType?: "icon" | "standard";
  buttonLabel?: string;
};
export const Dropdown = ({
  children,
  buttonIcon = <EllipsisIcon />,
  buttonType = "icon",
  buttonLabel,
  buttonVariant = "ghost",
}: DropdownProps) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu>
        {buttonType === "icon" ? (
          <MenuButton
            as={IconButton}
            icon={buttonIcon}
            variant={buttonVariant}
          />
        ) : (
          <MenuButton as={Button} variant={buttonVariant}>
            {buttonLabel}
          </MenuButton>
        )}
        {/* <MenuButton as={IconButton} icon={buttonIcon} variant={buttonVariant} /> */}

        <Box top="0px" position="relative">
          <MenuList>{children}</MenuList>
        </Box>
      </Menu>
    </Box>
  );
};
