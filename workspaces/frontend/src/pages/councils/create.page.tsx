import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import CouncilForm from "../../components/CouncilForm";

export function Page() {
  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create council
          </Heading>
          <CouncilForm mode="create" />
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Council / Create",
} satisfies DocumentProps;
