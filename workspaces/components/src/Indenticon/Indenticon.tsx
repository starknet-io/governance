import { Box } from "@chakra-ui/react";

import { useColorGenerator } from "./useColorGenerator";
type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  const { color, svg } = useColorGenerator(`${address}`, size);
  console.log(color, address);
  return (
    <Box borderRadius="full" overflow="hidden" position="relative">
      <div>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </Box>
  );
};
