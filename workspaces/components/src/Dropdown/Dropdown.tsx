import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";

import { EllipsisIcon } from "#src/Icons";
import { Portal } from "@chakra-ui/react";

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
    <Box>
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
        <Portal>
          <MenuList>{children}</MenuList>
        </Portal>
      </Menu>
    </Box>
  );
};
