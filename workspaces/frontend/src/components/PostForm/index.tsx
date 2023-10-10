import { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  MarkdownEditor,
  useMarkdownEditor,
  DeletionDialog,
  useDisclosure,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import type { Post } from "@yukilabs/governance-backend/src/db/schema/posts";
import { useFileUpload } from "src/hooks/useFileUpload";
import { usePageContext } from "../../renderer/PageContextProvider";

type PostFormProps = {
  post?: Post;
  isFetchPostSuccess?: boolean;
  mode: "create" | "edit";
};

export function PostForm({ post, isFetchPostSuccess, mode }: PostFormProps) {
  const {
    handleSubmit,
    register,
    trigger,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm<RouterInput["posts"]["savePost"]>();

  const [councilId, setCouncilId] = useState<string>("");
  const createPost = trpc.posts.savePost.useMutation();
  const deletePost = trpc.posts.deletePost.useMutation();
  const pageContext = usePageContext();
  const editPost = trpc.posts.editPost.useMutation();

  const councilSlug =
    trpc.councils.getCouncilSlug.useQuery({ councilId: Number(councilId) })
      .data ?? "";
  const { handleUpload } = useFileUpload();
  const {
    editorValue,
    handleEditorChange,
    clearEditor,
    editor,
    convertMarkdownToSlate,
  } = useMarkdownEditor("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCouncilId(urlParams.get("councilId") ?? "");
  }, []);

  useEffect(() => {
    if (mode === "edit" && isFetchPostSuccess) {
      if (post && window !== undefined) processData();
    }
  }, [post, isFetchPostSuccess, mode]);

  const processData = async () => {
    clearEditor();
    setValue("title", post?.title ?? "");
    editor.insertNodes(await convertMarkdownToSlate(post?.content || ""));
    setTimeout(() => {
      trigger();
    }, 10);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.content = editorValue;
      if (mode === "create") {
        data.councilId = Number(councilId);
      } else if (mode === "edit") {
        data.id = post?.id as number;
      }

      const mutation = mode === "create" ? createPost : editPost;
      await mutation.mutateAsync(data, {
        onSuccess: (res) => {
          mode === "edit"
            ? navigate(
                `/councils/${pageContext.routeParams!.slug}/posts/${res?.slug}`,
              )
            : navigate(`/councils/${councilSlug}`);
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

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

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const cancelRef = useRef(null);

  return (
    <>
      <DeletionDialog
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onDelete={handleDeletePost}
        cancelRef={cancelRef}
        entityName="Post"
      />
      <form onSubmit={onSubmit}>
        <Stack spacing="32px" direction={{ base: "column" }}>
          <FormControl id="delegate-statement">
            <FormLabel>Title</FormLabel>
            <Input
              variant="primary"
              size="standard"
              placeholder="Post title"
              {...register("title", {
                required: true,
              })}
            />
            {errors.title && <span>Add a title to your post</span>}
          </FormControl>
          <FormControl id="proposal-body">
            <FormLabel>Content</FormLabel>
            <Controller
              name="content"
              control={control} // Use control from useForm
              rules={{
                validate: {
                  required: (value) => {
                    // Trim the editorValue to remove spaces and new lines
                    console.log(editorValue);
                    const trimmedValue = editorValue?.trim();

                    if (!trimmedValue?.length || !trimmedValue) {
                      return "Add text to your post";
                    }
                  },
                },
              }}
              render={({ field }) => (
                <MarkdownEditor
                  onChange={(e) => {
                    handleEditorChange(e);
                    field.onChange(e);
                    if (errors.content) {
                      trigger("content");
                    }
                  }}
                  customEditor={editor}
                  value={editorValue}
                  handleUpload={handleUpload}
                  placeholder={`Type here...`}
                />
              )}
            />
            {errors.content && <span>{errors.content.message}</span>}
          </FormControl>
          {mode === "create" ? (
            <Flex justifyContent="flex-end">
              <Button type="submit" size="condensed" variant="primary">
                Create post
              </Button>
            </Flex>
          ) : (
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
              <Button type="submit" size="condensed" variant="primary">
                Save
              </Button>
            </Flex>
          )}
        </Stack>
      </form>
    </>
  );
}

export default PostForm;
