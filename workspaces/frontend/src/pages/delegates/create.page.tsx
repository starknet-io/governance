import { Heading } from "@yukilabs/governance-components";
import { DocumentProps } from "src/renderer/types";
import DelegateForm from "../../components/DelegateForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

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
} satisfies DocumentProps;
