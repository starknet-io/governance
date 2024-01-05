import { DocumentProps } from "#src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";

import { trpc } from "#src/utils/trpc";
import { usePageContext } from "#src/renderer/PageContextProvider";
import CouncilForm from "../../../components/CouncilForm";

export function Page() {
  const pageContext = usePageContext();
  const { data: council, isSuccess } = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });
  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit council
          </Heading>
          <CouncilForm
            mode="edit"
            council={council}
            isFetchingCouncilSuccess={isSuccess}
          />
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Council / Edit",
  image: "/social/social-councils.png",
} satisfies DocumentProps;
