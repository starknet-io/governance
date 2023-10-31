import { DocumentProps } from "src/renderer/types";
import { Heading } from "@yukilabs/governance-components";
import CouncilForm from "../../components/CouncilForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

export function Page() {
  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Create council
      </Heading>
      <CouncilForm mode="create" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Council / Create",
  image: "/social/social-councils.png",
} satisfies DocumentProps;
