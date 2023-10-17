import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import DelegateForm from "../../../../components/DelegateForm";
import {trpc} from "../../../../utils/trpc";
import {usePageContext} from "../../../../renderer/PageContextProvider";


export function Page() {
  const pageContext = usePageContext();

  const { data: delegate, isSuccess } = trpc.delegates.getDelegateById.useQuery(
    {
      id: pageContext.routeParams!.id,
    },
  );
  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit Delegate
          </Heading>
          <DelegateForm mode="edit" delegate={delegate} isFetchingDelegateSuccess={isSuccess}/>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Delegate / Edit",
} satisfies DocumentProps;
