import { DocumentProps } from "src/renderer/types";
import { Heading } from "@yukilabs/governance-components";
import LearnForm from "../../../components/LearnForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

export function Page() {
  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Edit Page
      </Heading>
      <LearnForm mode="edit" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Learn / Edit",
} satisfies DocumentProps;
