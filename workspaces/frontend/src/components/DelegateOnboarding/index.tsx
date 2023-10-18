import { Box, Container, Flex } from "@chakra-ui/react";
import { Logo, Text, Heading } from "@yukilabs/governance-components";
import DelegateForm from "../DelegateForm";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";

type Props = {
  mode: "create" | "edit";
  id?: string; // Only required in edit mode
  delegate?: Delegate;
  isFetchingDelegateSuccess?: boolean;
};

export const DelegateOnboarding = ({
  delegate,
  isFetchingDelegateSuccess,
  id,
  mode,
}: Props) => {
  return (
    <Box>
      <Box
        bg="radial-gradient(573.81% 50% at 50% 50%, #F9F3EF 0%, #F5F2FA 82.25%, #F1F6FA 100%)"
        borderBottom="1px solid"
        borderColor="border.forms"
      >
        <Container maxWidth="670px">
          <Flex
            flexDirection={"column"}
            justifyContent={"center"}
            py="standard.2xl"
          >
            <Box overflow="hidden" mb="24px">
              <Logo padding="0" href="#" paddingLeft="0" />
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
                Before you get started in the Governence Hub please review your
                delegate profile and add any updates you would like to share
                with the community.
              </Text>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container maxWidth="670px">
        <Box mt="standard.2xl" pb="standard.3xl">
          <DelegateForm
            mode={mode}
            delegate={delegate}
            isFetchingDelegateSuccess={isFetchingDelegateSuccess}
            isOnboarding={true}
          />
        </Box>
      </Container>
    </Box>
  );
};
