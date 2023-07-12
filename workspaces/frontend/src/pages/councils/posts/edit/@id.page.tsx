import { DocumentProps } from "src/renderer/types";
import { useEffect, useState, useRef } from "react";
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
  QuillEditor,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<RouterInput["posts"]["editPost"]>();
  const [editorValue, setEditorValue] = useState<string>("");
  const editPost = trpc.posts.editPost.useMutation();
  const pageContext = usePageContext();
  const postResp = trpc.posts.getPostById.useQuery({
    id: Number(pageContext.routeParams!.id),
  });

  const { data: post } = postResp;

  const deletePost = trpc.posts.deletePost.useMutation();

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
    if (post) {
      setValue("title", post.title ?? "");
      setEditorValue(post.content ?? "");
    }
  }, [post]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.content = editorValue;
      data.id = Number(pageContext.routeParams!.id);
      await editPost.mutateAsync(data).then(() => {
        navigate(`/councils/posts/${pageContext.routeParams!.id}`);
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Post
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this post?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  color="#D83E2C"
                  onClick={handleDeletePost}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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
                {errors.title && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Content</FormLabel>
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  size="sm"
                  variant={"outline"}
                  mr="auto"
                  color="#D83E2C"
                  onClick={onOpen}
                >
                  Delete
                </Button>
                <Button
                  as="a"
                  size="sm"
                  variant={"ghost"}
                  href={`/councils/posts/${pageContext.routeParams!.id}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
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
