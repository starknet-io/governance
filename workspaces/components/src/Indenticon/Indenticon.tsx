import { Box } from "@chakra-ui/react";

import { useColorGenerator } from "./useColorGenerator";
type Props = {
  address?: string | null;
  size?: number;
};

export const Indenticon = ({ address, size = 60 }: Props) => {
  const { svg } = useColorGenerator(`${address}`, size);
  return (
    <Box borderRadius="full" overflow="hidden" position="relative">
      <div>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </Box>
  );
};
