import {
  Heading,
  ContentContainer,
  Box,
} from "@yukilabs/governance-components";
import { DocumentProps } from "src/renderer/types";
import DelegateForm from "../../components/DelegateForm";


export function Page() {
  return (
    <>
      <ContentContainer>
        <Box maxWidth="670px" pb="200px" mx="auto">
          <Heading variant="h2" mb="24px">
            Create delegate profile
          </Heading>
          <DelegateForm mode="create" />
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Delegates / Create",
} satisfies DocumentProps;
