import { Box, Image } from "@chakra-ui/react";

import img from "./assets/voting-starts-in-X-days.svg";
export const PlaceholderImage = () => {
  return (
    <Box
      width="100%"
      height=" 240px"
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Image src={img} width="240px" />
    </Box>
  );
};
