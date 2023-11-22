import { Box } from "@chakra-ui/react";
import Avatar from "boring-avatars";

type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  const brandColors = [
    "#3F8CFF",
    "#EC796B",
    "#F6C9CE",
    "#F9E8E8",
    "#A1A1D6",
    "#2F44B2",
    "#90EAC4",
    "#FBF2B1",
    "#E175B1",
  ];

  return (
    <Box overflow="hidden" width={`${size}px`} height={`${size}px`}>
      <Avatar
        size={size}
        name={address}
        variant="marble"
        colors={brandColors}
      />
    </Box>
  );
};
