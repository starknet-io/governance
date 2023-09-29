import { Box, Flex, HStack, Icon, Image, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "src/Icons";
import { Text } from "src/Text";

type Props = {
  iconUrl?: string;
  subtitle?: string;
  title?: string;
  href: string;
};

export const LinkCard = ({
  iconUrl = "https://starkware.co/wp-content/uploads/2023/02/SN-Symbol-Gradient.png",
  subtitle = "Forum discussion",
  title = "[PROPOSAL] Support for scoped storage variables",
  href,
}: Props) => {
  return (
    <Link href={href}>
      <HStack
        alignItems="center"
        border="1px solid #E4E5E7"
        borderRadius="6px"
        p="20px"
        spacing="20px"
      >
        <Box>
          <Image src={iconUrl} alt="icon" width="32px" height="32px" />
        </Box>
        <Flex flexDirection="column" gap="2px" flex={1}>
          <Text fontSize="12px" color="#6C6C75" fontWeight="500">
            {subtitle}
          </Text>
          <Text fontSize="14px" color="#292932" fontWeight="500">
            {" "}
            {title}
          </Text>
        </Flex>
        <Box>
          <Icon as={ExternalLinkIcon} />
        </Box>
      </HStack>
    </Link>
  );
};
