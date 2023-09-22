import React from "react";
import { Box, IconButton, useToast, useClipboard } from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
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
        icon={<MdContentCopy size="14px" />}
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
