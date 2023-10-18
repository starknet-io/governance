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
    <Box
      bg="radial-gradient(573.81% 50% at 50% 50%, #F9F3EF 0%, #F5F2FA 82.25%, #F1F6FA 100%)"
      borderBottom="1px solid"
      borderColor="border.forms"
      height="206px"
    >
      <Container maxWidth="670px">
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          gap="24px"
          pt="48px"
        >
          <Box mt="-18px" height="38px">
            <Box mt="-19px" ml="-20px">
              <Logo href="#" height="38px" paddingLeft="0" />
            </Box>
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
        <Box mt="standard.3xl" pb="standard.3xl">
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
