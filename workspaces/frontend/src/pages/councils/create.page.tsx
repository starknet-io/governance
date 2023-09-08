import { DocumentProps } from "src/renderer/types";
import { useState } from "react";
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
  EditorTemplate,
  MembersList,
  MarkdownEditor,
  useMarkdownEditor,
} from "@starknet-foundation/governance-ui";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@starknet-foundation/governance-ui/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();

  const [members, setMembers] = useState<MemberType[]>([]);
  const createCouncil = trpc.councils.saveCouncil.useMutation();

  const { editorValue, handleEditorChange, editor } = useMarkdownEditor(
    "",
    EditorTemplate.proposalMarkDown,
  );
  const {
    editorValue: shortDescValue,
    handleEditorChange: handleShortDescValue,
  } = useMarkdownEditor("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = editorValue;
      data.description = shortDescValue;
      data.slug = "";
      data.members = members;
      await createCouncil.mutateAsync(data, {
        onSuccess: (res) => {
          navigate(`/councils/${res.slug}`);
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
            Create council
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="council-name">
                <FormLabel>Council name</FormLabel>
                <Input
                  variant="primary"
                  size="standard"
                  placeholder="Name"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="description">
                <FormLabel>Short description</FormLabel>
                <MarkdownEditor
                  onChange={handleShortDescValue}
                  value={shortDescValue}
                  minHeight="100px"
                  hideTabBar
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="statement">
                <FormLabel>Council statement</FormLabel>
                <MarkdownEditor
                  value={editorValue}
                  onChange={handleEditorChange}
                  customEditor={editor}
                />
                {errors.statement && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="council-members">
                <MembersList members={members} setMembers={setMembers} />
              </FormControl>

              <FormControl id="council-name">
                <FormLabel>Multisig address</FormLabel>
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="0x..."
                  {...register("address")}
                />
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button type="submit" variant="primary" isDisabled={!isValid}>
                  Create council
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
  title: "Snip / Create",
} satisfies DocumentProps;
