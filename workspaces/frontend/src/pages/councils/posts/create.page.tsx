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
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["posts"]["savePost"]>();

  const [councilId, setCouncilId] = useState<string>("");
  const createPost = trpc.posts.savePost.useMutation();
  const councilSlug =
    trpc.councils.getCouncilSlug.useQuery({ councilId: Number(councilId) })
      .data ?? "";

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
                  placeholder="Post title"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Content</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
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
