import { Box } from "@chakra-ui/react";
import { Text } from "../Text";

type Props = {
  label: string;
};

export const Status = ({ label }: Props) => {
  return (
    <Box
      borderRadius="4px"
      mb="24px"
      px="32px"
      py="12px"
      bg={"surface.info.default"}
    >
      <Text variant="smallStrong" color="content.onSurface.default">
        {label}
      </Text>
    </Box>
  );
};
