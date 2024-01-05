import { Box, BoxProps } from "@chakra-ui/react";
import { Heading } from "../Heading";
import { Text } from "../Text";
import { Link } from "../Link";

type Props = {
  title: string;
  description?: string;
  learnMoreLink?: string;
  standard?: boolean;
} & BoxProps;

export const PageTitle = ({ title, description, standard = true, learnMoreLink, ...rest }: Props) => {
  return (
    <Box mb="24px" {...rest}>
      <Heading fontSize="28px" as="h2" variant="h3" mb="12px" color="#1A1523">
        {title}
      </Heading>
      {description && (
        <Box maxWidth="900px" pb={standard ? "24px" : "0"}>
          <Text
            color="#4A4A4F"
            lineHeight="24px"
            variant="body"
            fontWeight={"400"}
            fontSize="15px"
            mb="4px"
          >
            {description}
          </Text>

          {learnMoreLink && (
            <Link variant="secondary" size="medium" href={learnMoreLink}>
              Learn more
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
};
