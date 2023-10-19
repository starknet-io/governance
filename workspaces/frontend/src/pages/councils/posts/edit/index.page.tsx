import { DocumentProps } from "src/renderer/types";
import { Heading } from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import PostForm from "../../../../components/PostForm";
import { FormLayout } from "src/components/FormsCommon/FormLayout";

export function Page() {
  const pageContext = usePageContext();
  const { data: post, isSuccess } = trpc.posts.getPostBySlug.useQuery({
    slug: pageContext.routeParams!.postSlug,
  });

  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Edit post
      </Heading>
      <PostForm mode="edit" post={post} isFetchPostSuccess={isSuccess} />
    </FormLayout>
  );
}

export const documentProps = {
  title: "Post / Edit",
  image: "src/images/social-councils.png"
} satisfies DocumentProps;
