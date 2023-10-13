import { Box, Container, Flex } from "@chakra-ui/react";
import { Logo, Text, Heading } from "@yukilabs/governance-components";
import DelegateForm from "../DelegateForm";

type Props = {};

export const DelegateOnboarding = (props: Props) => {
  return (
    <Box
      position="fixed"
      inset="0"
      top="0"
      maxHeight="100vh"
      backgroundColor="#F9F8F9"
      zIndex={2}
      overflow={"auto"}
      pb="standard.3xl"
    >
      <Box
        bg="radial-gradient(573.81% 50% at 50% 50%, #F9F3EF 0%, #F5F2FA 82.25%, #F1F6FA 100%)"
        borderBottom="1px solid"
        borderColor="border.forms"
        height="206px"
      >
        <Container maxWidth="670px" pt="standard.2xl">
          <Flex flexDirection={"column"} justifyContent={"center"} gap="24px">
            <Box>
              <Logo href="#" height="38px" paddingLeft="0" />
            </Box>
            <Box>
              <Heading mb="12px" variant="h2" color="content.accent.default">
                Review your delegate profile
              </Heading>
              <Text
                variant="large"
                color="content.default.default"
                fontWeight={"400"}
              >
                Before you jump into the Governence Hub please review your
                delegate statement, make sure nothing is missing or make any
                updates.
              </Text>
            </Box>
          </Flex>
          <Box mt="standard.3xl">
            <DelegateForm mode="edit" />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
