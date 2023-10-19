import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import PostForm from "../../../components/PostForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

export function Page() {
  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Create Post
      </Heading>
      <PostForm mode="create" />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Post / Create",
  image: "src/images/social-councils.png"
} satisfies DocumentProps;
