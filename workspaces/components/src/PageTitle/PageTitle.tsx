import { Box, Divider } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { Text } from "src/Text";

type Props = {
  title: string;
  description?: string;
  learnMoreLink?: string;
};

export const PageTitle = ({ title, description, learnMoreLink }: Props) => {
  return (
    <Box marginBottom="24px">
      <Heading as="h2" variant="h3" mb="12px">
        {title}
      </Heading>
      {description && (
        <Box maxWidth="650px">
          <Text
            color="#6C6C75"
            lineHeight="26px"
            variant="body"
            fontSize="16px"
          >
            {description}{" "}
            {learnMoreLink && <a href={learnMoreLink}>Learn more</a>}
          </Text>
        </Box>
      )}
      <Divider marginTop="32px" />
    </Box>
  );
};
