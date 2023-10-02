import { Box, Image } from "@chakra-ui/react";
import img from "./assets/Star.svg";
import { useColorGenerator } from "./useColorGenerator";
type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  const { svg } = useColorGenerator(`${address}`, size);
  return (
    <Box borderRadius="full" overflow="hidden" position="relative">
      <Image
        width={size}
        position="absolute"
        inset="0"
        // top="14px"
        top="28%"
        left="-8%"
        src={img}
        zIndex={"1"}
        opacity="1"
        blendMode={"color-dodge"}
      />
      <div>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </Box>
  );
};
