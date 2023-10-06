import { DocumentProps } from "src/renderer/types";
import { useEffect, useState } from "react";
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
  MarkdownEditor,
  useMarkdownEditor,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";

export function Page() {
  const {
    handleSubmit,
    register,
    trigger,
    formState: { errors, isValid },
    control,
  } = useForm<RouterInput["posts"]["savePost"]>();

  const [councilId, setCouncilId] = useState<string>("");
  const createPost = trpc.posts.savePost.useMutation();
  const councilSlug =
    trpc.councils.getCouncilSlug.useQuery({ councilId: Number(councilId) })
      .data ?? "";
  const { handleUpload } = useFileUpload();
  const { editorValue, handleEditorChange } = useMarkdownEditor("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCouncilId(urlParams.get("councilId") ?? "");
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.content = editorValue;
      data.councilId = Number(councilId);
      await createPost.mutateAsync(data, {
        onSuccess: () => {
          navigate(`/councils/${councilSlug}`);
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create Post
          </Heading>
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
                          trigger("statement");
                        }
                      }}
                      value={editorValue}
                      handleUpload={handleUpload}
                      placeholder={`Type here...`}
                    />
                  )}
                />
                {errors.content && <span>{errors.content.message}</span>}
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button type="submit" size="condensed" variant="primary">
                  Create post
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
  title: "Post / Create",
} satisfies DocumentProps;
