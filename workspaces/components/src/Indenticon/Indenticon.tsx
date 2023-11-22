import { Box } from "@chakra-ui/react";
import Avatar from "boring-avatars";

type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  // Define your brand's color palette
  const brandColors = ["#3F8CFF", "#2F44B2", "#F6C9CE", "#F9E8E8", "#A1A1D6"];

  return (
    <Box
      // borderRadius="full"
      overflow="hidden"
      width={`${size}px`}
      height={`${size}px`}
    >
      <Avatar
        size={size}
        name={address}
        variant="marble"
        colors={brandColors}
      />
    </Box>
  );
};
