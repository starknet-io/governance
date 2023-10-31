export const layout = "LayoutOnboarding";

import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import DelegateForm from "../../../../components/DelegateForm";
import { trpc } from "../../../../utils/trpc";
import { usePageContext } from "../../../../renderer/PageContextProvider";
import { DelegateOnboarding } from "src/components/DelegateOnboarding";

export function Page() {
  const pageContext = usePageContext();

  const { data: delegate, isSuccess } = trpc.delegates.getDelegateById.useQuery(
    {
      id: pageContext.routeParams!.id,
    },
  );
  return (
    <Box>
      <Box width="100%" mx="auto">
        <DelegateOnboarding
          mode="edit"
          delegate={delegate}
          isFetchingDelegateSuccess={isSuccess}
        />
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Delegate / Edit",
  image: "/social/social-delegates.png",
} satisfies DocumentProps;
