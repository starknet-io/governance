import { Box, Link } from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { Text } from "src/Text";

type Props = {
  title: string;
  description?: string;
  learnMoreLink?: string;
};

export const PageTitle = ({ title, description, learnMoreLink }: Props) => {
  return (
    <Box mb="24px">
      <Heading as="h2" variant="h3" mb="12px" color="#1A1523">
        {title}
      </Heading>
      {description && (
        <Box maxWidth="900px" pb="24px">
          <Text
            color="#4A4A4F"
            lineHeight="24px"
            variant="body"
            fontWeight={"400"}
            fontSize="15px"
          >
            {description}
          </Text>

          {learnMoreLink && (
            <Link variant="secondary" href={learnMoreLink}>
              Learn more
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
};
