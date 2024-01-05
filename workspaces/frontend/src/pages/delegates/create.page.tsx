import { Heading } from "@yukilabs/governance-components";
import { FormLayout } from "#src/components/FormsCommon/FormLayout";
import { DocumentProps } from "#src/renderer/types";
import DelegateForm from "../../components/DelegateForm";

export function Page() {

  return (
    <FormLayout>
      <Heading variant="h2" mb="24px">
        Create delegate profile
      </Heading>
      <DelegateForm mode="create" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Delegates / Create",
  image: "/social/social-delegates.png",
} satisfies DocumentProps;
