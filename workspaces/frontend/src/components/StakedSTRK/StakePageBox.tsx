import { Box, Flex, Text } from "@chakra-ui/react";
import { Button } from "@yukilabs/governance-components";

export type StakePageBoxProps = {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  href: string;
};

export const StakePageBox = (props: StakePageBoxProps) => {
  const { key, label, icon, description, href } = props;

  return (
    <Box
      key={key}
      flex="1"
      border="1px solid"
      borderColor="border.dividers"
      borderRadius="4px"
      p="standard.xl"
      display="flex"
      flexDirection="column"
      gap="standard.md"
    >
      <Flex alignItems="center" gap="standard.sm">
        <Box width="120px" height="50px">
          {icon}
        </Box>
      </Flex>
      <Text variant="mediumStrong" color="content.support.default">
        {description}
      </Text>
      <Box mt="auto">
        <Button as="a" href={href} isExternal variant="primary" width="100%">
          {label}
        </Button>
      </Box>
    </Box>
  );
};
