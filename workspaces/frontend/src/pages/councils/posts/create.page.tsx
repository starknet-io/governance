import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import PostForm from "../../../components/PostForm";

export function Page() {
  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create Post
          </Heading>
          <PostForm mode="create" />
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Post / Create",
} satisfies DocumentProps;
