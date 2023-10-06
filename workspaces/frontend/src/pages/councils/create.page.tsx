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
import { useForm, Controller } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { ethers } from "ethers";

export function Page() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    trigger,
  } = useForm<RouterInput["councils"]["saveCouncil"]>();

  const [members, setMembers] = useState<MemberType[]>([]);
  const [error, setError] = useState<string>("");
  const createCouncil = trpc.councils.saveCouncil.useMutation();
  const { handleUpload } = useFileUpload();
  const utils = trpc.useContext();
  const { editorValue, handleEditorChange, editor } = useMarkdownEditor("");
  const [shortDescValue, setShortDescValue] = useState("");

  const isValidAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

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
                {errors.name && <span>Add council name</span>}
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
                  {...register("description", {
                    required: true,
                  })}
                  onChange={(e) => setShortDescValue(e.target.value)}
                />
                {errors.description && <span>Add council description</span>}
              </FormControl>

              <FormControl id="statement">
                <FormLabel>Council statement</FormLabel>
                <Controller
                  name="statement"
                  control={control} // control comes from useForm()
                  defaultValue=""
                  rules={{
                    validate: {
                      required: (value) => {
                        // Trim the editorValue to remove spaces and new lines
                        const trimmedValue = editorValue?.trim();

                        if (!trimmedValue?.length || !trimmedValue) {
                          return "Add council statement";
                        }
                      },
                    },
                  }}
                  render={({ field }) => (
                    <MarkdownEditor
                      value={editorValue}
                      onChange={(val) => {
                        handleEditorChange(val);
                        field.onChange(val);
                        if (errors.statement) {
                          trigger("statement");
                        }
                      }}
                      customEditor={editor}
                      handleUpload={handleUpload}
                      offsetPlaceholder={"-8px"}
                      placeholder={`
Role of the [Name] council
How the [Name] council works
FAQs
Links
                        `}
                    />
                  )}
                />
                {errors.statement && <span>{errors.statement.message}</span>}
              </FormControl>

              <FormControl id="council-members">
                <MembersList members={members} setMembers={setMembers} />
              </FormControl>

              <FormControl id="council-name">
                <FormLabel>Multisig address (optional)</FormLabel>
                <Input
                  size="standard"
                  variant="primary"
                  placeholder="0x..."
                  {...register("address", {
                    validate: {
                      isValidEthereumAddress: (value) =>
                        !value ||
                        !value.length ||
                        isValidAddress(value) ||
                        "Invalid Ethereum address.",
                    },
                  })}
                />
                {errors.address && <span>{errors.address.message}</span>}
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button type="submit" variant="primary">
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
