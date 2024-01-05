import { Box, Flex, HStack, Image, Link } from "@chakra-ui/react";
import { ArrowRightLargeIcon } from "../Icons";
import { Text } from "../Text";

type Props = {
  src?: string;
  description?: string;
  title?: string;
  href: string;
};

export const LinkCard = ({ src, description, title, href }: Props) => {
  return (
    <Link href={href}>
      <HStack
        alignItems="center"
        border="1px solid "
        borderColor="border.forms"
        borderRadius="8px"
        p="standard.md"
        spacing="20px"
        boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
        _hover={{
          borderColor: "#C8C7CB",
        }}
      >
        <Box width="40px" height="40px" borderRadius="50%" overflow="hidden">
          <Image
            src={src}
            alt="icon"
            width="100%"
            height="100%"
            objectFit={"cover"}
          />
        </Box>
        <Flex flexDirection="column" gap="2px" flex={1}>
          <Text
            color="content.default.default"
            lineHeight={"20px"}
            variant="small"
            noOfLines={1}
          >
            {title}
          </Text>
          <Text
            variant="mediumStrong"
            color="content.accent.default"
            fontWeight="500"
            noOfLines={1}
          >
            {description}
          </Text>
        </Flex>
        <Box>
          <ArrowRightLargeIcon boxSize="32px" color="content.default.default" />
        </Box>
      </HStack>
    </Link>
  );
};
