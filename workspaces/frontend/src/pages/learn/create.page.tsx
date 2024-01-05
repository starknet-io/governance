import { DocumentProps } from "#src/renderer/types";
import { Heading } from "@yukilabs/governance-components";
import LearnForm from "../../components/LearnForm";
import { FormLayout } from "#src/components/FormsCommon/FormLayout";

export function Page() {
  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Create Page
      </Heading>
      <LearnForm mode="create" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Learn / Create",
  image: "/social/social-learn.png",
} satisfies DocumentProps;
