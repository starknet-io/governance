import { DocumentProps } from "src/renderer/types";
import { Heading } from "@yukilabs/governance-components";
import DelegateForm from "../../../../components/DelegateForm";
import { trpc } from "../../../../utils/trpc";
import { usePageContext } from "../../../../renderer/PageContextProvider";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

export function Page() {
  const pageContext = usePageContext();

  const { data: delegate, isSuccess } = trpc.delegates.getDelegateById.useQuery(
    {
      id: pageContext.routeParams!.id,
    },
  );
  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Edit Delegate
      </Heading>
      <DelegateForm
        mode="edit"
        delegate={delegate}
        isFetchingDelegateSuccess={isSuccess}
      />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Delegate / Edit",
  image: "src/images/social-delegates.png"
} satisfies DocumentProps;
