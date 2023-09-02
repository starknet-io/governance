import { Button } from "@chakra-ui/react";
import React from "react";

type Props = {
  active?: boolean;
  icon?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  label: string;
  variant?: "navLink" | "feedback";
};

export const NavItem = ({
  href,
  icon,
  label,
  onClick,
  variant = "navLink",
}: Props) => {
  if (href) {
    return (
      <Button
        leftIcon={icon && icon}
        as="a"
        href={href}
        size="navLink"
        variant={variant}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      size="navLink"
      variant={variant}
      leftIcon={icon && icon}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
