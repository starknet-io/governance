import React from "react";
import { Button } from "@yukilabs/governance-components";

type Props = {
  onSelect: () => void;
  isSelected?: boolean;
  label: string;
};

const TabButton = ({ onSelect, isSelected, label }: Props) => {
  return (
    <Button
      variant="primary"
      size="condensed"
      sx={{
        display: "flex",
        minWidth: "48px",
        py: "4px",
        px: "16px",
        justifyContent: "center",
        alignItems: "center",
        gap: "standard.base",
        flex: "1 0 0",
        borderRadius: "999px",
        background: !isSelected ? "transparent" : "surface.forms.selected",
        height: "28px",
        minHeight: "28px",
        color: !isSelected
          ? "content.support.default"
          : "content.support.hover",
        fontSize: "12px",
        _hover: {
          color: "content.support.hover",
          background: !isSelected ? "transparent" : "surface.forms.selected",
        },
      }}
      onClick={onSelect}
    >
      {label}
    </Button>
  );
};

export default TabButton;
