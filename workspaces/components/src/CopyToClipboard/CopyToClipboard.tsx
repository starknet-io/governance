import React from "react";
import { Box, IconButton, useToast, useClipboard } from "@chakra-ui/react";
import { CopyIcon } from "src/Icons";

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  iconSize?: string;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  iconSize = "13px",
}) => {
  const { onCopy } = useClipboard(text);
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Copied to clipboard",
      position: "top-right",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box display={"flex"} alignItems="center">
      {children}
      <IconButton
        aria-label="Copy to clipboard"
        icon={<CopyIcon boxSize={iconSize} />}
        variant="ghost"
        size="xs"
        borderRadius={0}
        width="auto"
        minWidth="auto"
        pl="8px"
        py="0"
        height="auto "
        onClick={handleCopy}
      />
    </Box>
  );
};
