import { Box } from "@chakra-ui/react";
import { Text } from "src/Text";

type Props = {
  label: string;
};

export const Status = ({ label }: Props) => {
  return (
    <Box
      borderRadius="4px"
      mb="24px"
      padding="12px"
      bg="#4A4A4F"
      fontSize="12px"
    >
      <Text variant="breadcrumbs" color="white">
        {label}
      </Text>
    </Box>
  );
};
