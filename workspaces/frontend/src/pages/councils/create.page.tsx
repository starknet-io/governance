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
  Textarea,
  Banner,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();

  const [members, setMembers] = useState<MemberType[]>([]);
  const [error, setError] = useState<string>("");
  const createCouncil = trpc.councils.saveCouncil.useMutation();
  const { handleUpload } = useFileUpload();
  const utils = trpc.useContext();
  const { editorValue, handleEditorChange, editor } = useMarkdownEditor(
    "",
    EditorTemplate.proposalMarkDown,
  );
  const [shortDescValue, setShortDescValue] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      data.statement = editorValue;
      data.description = shortDescValue;
      data.slug = "";
      data.members = members;
      await createCouncil.mutateAsync(data, {
        onSuccess: (res) => {
          utils.councils.getAll.invalidate();
          navigate(`/councils/${res.slug}`);
        },
      });
    } catch (error) {
      // Handle error
      setError(`Error: ${error?.message}` || "An Error occurred");
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
                <Textarea
                  variant="primary"
                  name="comment"
                  maxLength={280}
                  placeholder="Short description"
                  rows={4}
                  focusBorderColor={"#292932"}
                  resize="none"
                  value={shortDescValue}
                  onChange={(e) => setShortDescValue(e.target.value)}
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="statement">
                <FormLabel>Council statement</FormLabel>
                <MarkdownEditor
                  value={editorValue}
                  onChange={handleEditorChange}
                  customEditor={editor}
                  handleUpload={handleUpload}
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
              {error && error.length && (
                <Banner label={error} variant="error" type="error" />
              )}
            </Stack>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Council / Create",
} satisfies DocumentProps;
