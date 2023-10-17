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
  FormControlled,
  useFormErrorHandler,
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
  } = useForm<RouterInput["posts"]["savePost"]>({
    shouldFocusError: false,
  });

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

  const { setErrorRef, scrollToError } = useFormErrorHandler([
    "title",
    "content",
  ]);

  const onErrorSubmit = (errors) => {
    if (Object.keys(errors).length > 0) {
      scrollToError(errors);
    }
  };

  const onSubmitHandler = async (data) => {
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
  };

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
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorSubmit)} noValidate>
        <Stack spacing="standard.xl" direction={{ base: "column" }}>
          <FormControlled
            ref={(ref) => setErrorRef("title", ref)}
            name="title"
            label="Title"
            isRequired
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message || "Add a title to your post"}
          >
            <Input
              variant="primary"
              size="standard"
              placeholder="Post title"
              isInvalid={!!errors.title}
              {...register("title", {
                required: true,
              })}
            />
          </FormControlled>
          <FormControlled
            ref={(ref) => setErrorRef("content", ref)}
            name="content"
            label="Content"
            isRequired
            isInvalid={!!errors.content}
            errorMessage={errors.content?.message || "Add text to your post"}
          >
            <Controller
              name="content"
              control={control}
              rules={{
                validate: {
                  required: (value) => {
                    // Trim the editorValue to remove spaces and new lines

                    const trimmedValue = editorValue?.trim();

                    if (!trimmedValue?.length) {
                      return "Add text to your post";
                    }
                  },
                },
              }}
              render={({ field }) => (
                <MarkdownEditor
                  isInvalid={!!errors.content}
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
          </FormControlled>
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
