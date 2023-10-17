import { DocumentProps } from "src/renderer/types";
import {
  Box,
  Heading,
  ContentContainer,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import PostForm from "../../../../components/PostForm";

export function Page() {
  const pageContext = usePageContext();
  const { data: post, isSuccess } = trpc.posts.getPostBySlug.useQuery({
    slug: pageContext.routeParams!.postSlug,
  });

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit post
          </Heading>
          <PostForm mode="edit" post={post} isFetchPostSuccess={isSuccess} />
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Post / Edit",
} satisfies DocumentProps;
