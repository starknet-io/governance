import { Box, Divider, Link } from "@chakra-ui/react";
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
      <Heading as="h2" variant="h3" mb="12px" color="#1A1523">
        {title}
      </Heading>
      {description && (
        <Box maxWidth="800px">
          <Text
            color="#57565D"
            lineHeight="26px"
            variant="body"
            fontSize="16px"
          >
            {description}
          </Text>

          {learnMoreLink && (
            <Link variant="body" href={learnMoreLink}>
              Learn more
            </Link>
          )}
        </Box>
      )}
      <Divider marginTop="32px" />
    </Box>
  );
};
