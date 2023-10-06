import { DocumentProps } from "src/renderer/types";
import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  ContentContainer,
  useDisclosure,
  DeletionDialog,
  useMarkdownEditor,
  MarkdownEditor,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = useRef(null);
  const editPost = trpc.posts.editPost.useMutation();
  const pageContext = usePageContext();
  const postResp = trpc.posts.getPostBySlug.useQuery({
    slug: pageContext.routeParams!.postSlug,
  });
  const { data: post } = postResp;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<RouterInput["posts"]["editPost"]>();

  const deletePost = trpc.posts.deletePost.useMutation();

  const {
    editorValue,
    handleEditorChange,
    editor,
    convertMarkdownToSlate,
    clearEditor,
  } = useMarkdownEditor("");

  const handleDeletePost = async () => {
    if (!post?.id) return;

    try {
      await deletePost.mutateAsync({ id: post.id });
      navigate(`/councils/${post.councilId}`);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  useEffect(() => {
    if (post && window !== undefined) processData();
  }, [post]);

  const processData = async () => {
    clearEditor();
    setValue("title", post?.title ?? "");
    editor.insertNodes(await convertMarkdownToSlate(post?.content || ""));
    trigger();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.content = editorValue;
      data.id = post?.id as number;
      await editPost.mutateAsync(data).then((res) => {
        navigate(
          `/councils/${pageContext.routeParams!.slug}/posts/${res?.slug}`,
        );
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <DeletionDialog
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          onDelete={handleDeletePost}
          cancelRef={cancelRef}
          entityName="Post"
        />

        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit post
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Title</FormLabel>
                <Input
                  variant="primary"
                  placeholder="Post title"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && <span>Add a title to your post</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Content</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  customEditor={editor}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  size="condensed"
                  variant="danger"
                  mr="auto"
                  onClick={onOpenDelete}
                >
                  Delete
                </Button>
                <Button
                  as="a"
                  size="condensed"
                  variant="ghost"
                  href={`/councils/posts/${pageContext.routeParams!.id}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="condensed"
                  variant="primary"
                  isDisabled={!isValid}
                >
                  Save
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Post / Edit",
} satisfies DocumentProps;
