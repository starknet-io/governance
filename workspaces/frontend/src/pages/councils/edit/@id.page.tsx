import { DocumentProps } from "src/renderer/types";
import { useEffect, useRef, useState } from "react";
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
  MembersList,
  useDisclosure,
  DeletionDialog,
  MarkdownEditor,
  useMarkdownEditor,
  Textarea,
  Banner,
} from "@yukilabs/governance-components";

import { trpc } from "src/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { useFileUpload } from "src/hooks/useFileUpload";
import { ethers } from "ethers";

export function Page() {
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = useRef(null);
  const {
    handleSubmit,
    register,
    setValue,
    control,
    trigger,
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();
  const { handleUpload } = useFileUpload();
  const [members, setMembers] = useState<MemberType[]>([]);
  const [error, setError] = useState("");
  const editCouncil = trpc.councils.editCouncil.useMutation();
  const pageContext = usePageContext();
  const { data: council, isSuccess } = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });
  const removeUserFromCouncilData =
    trpc.councils.deleteUserFromCouncil.useMutation();

  const utils = trpc.useContext();

  const { editorValue, handleEditorChange, editor, setMarkdownValue } =
    useMarkdownEditor("");
  const [shortDescValue, setShortDescValue] = useState("");
  useEffect(() => {
    if (council && isSuccess) processData();
  }, [isSuccess]);

  async function processData() {
    setValue("name", council?.name);
    setValue("address", council?.address);
    setShortDescValue(council?.description ?? "");
    await setMarkdownValue(council?.statement ?? "");

    const tempMembers = council?.members?.map((member: any) => {
      return {
        address: member.user.address,
        name: member.user.name,
        twitterHandle: member.user.twitter,
        miniBio: member.user.miniBio,
      };
    });
    setMembers(tempMembers ?? []);
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = editorValue;
      data.description = shortDescValue;
      data.slug = "";
      data.members = members;
      if (!council?.id) {
        return;
      }
      const saveData = {
        ...data,
        id: council.id,
      };
      await editCouncil
        .mutateAsync(saveData)
        .then((resp: any) => {
          utils.councils.getAll.invalidate();
          utils.councils.getCouncilBySlug.invalidate();
          navigate(`/councils/${resp.slug}`);
        })
        .catch((err) => {
          console.log(err);
          setError(err?.message ? err.message : JSON.stringify(err));
        });
      trigger()
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  const removeUserFromCouncil = (address: string) => {
    if (!council?.id) return;
    removeUserFromCouncilData.mutate({
      councilId: council?.id,
      userAddress: address,
    });
  };
  const deleteCouncil = trpc.councils.deleteCouncil.useMutation();
  // Delete function
  const handleDeleteCouncil = async () => {
    if (!council?.id) return;

    try {
      await deleteCouncil.mutateAsync({ id: council.id });
      navigate("/");
      utils.councils.getAll.invalidate();
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const isValidAddress = (address: string) => {
    try {
      const checksumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checksumAddress);
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      <ContentContainer>
        <DeletionDialog
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          onDelete={handleDeleteCouncil}
          cancelRef={cancelRef}
          entityName="Council"
        />
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit council
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="council-name">
                <FormLabel>Council name</FormLabel>
                <Input
                  variant="primary"
                  placeholder="Name"
                  {...register("name", {
                    required: true,
                  })}
                  defaultValue={council?.name ?? ""}
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
                  {...register("description", {
                    required: true,
                  })}
                  value={shortDescValue}
                  onChange={(e) => setShortDescValue(e.target.value)}
                />
                {errors.description && <span>This field is required.</span>}
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
                <MembersList
                  members={members}
                  setMembers={setMembers}
                  editMode
                  removeUserFromCouncil={removeUserFromCouncil}
                />
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
                  href={`/councils/${pageContext.routeParams!.id}`}
                >
                  Cancel
                </Button>
                <Button type="submit" size="condensed" variant="primary">
                  Save
                </Button>
              </Flex>
              {error.length ? (
                <Banner label={error} variant="error" type="error" />
              ) : null}
            </Stack>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Council / Edit",
} satisfies DocumentProps;
