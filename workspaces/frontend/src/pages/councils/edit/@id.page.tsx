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
} from "@yukilabs/governance-components";

import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";

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
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();

  const [members, setMembers] = useState<MemberType[]>([]);
  const editCouncil = trpc.councils.editCouncil.useMutation();
  const pageContext = usePageContext();
  const { data: council, isSuccess } = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });
  const removeUserFromCouncilData =
    trpc.councils.deleteUserFromCouncil.useMutation();

  const { editorValue, handleEditorChange, editor, setMarkdownValue } =
    useMarkdownEditor("");
  const {
    editor: shortDescEditor,
    editorValue: shortDescValue,
    handleEditorChange: handleShortDescValue,
    setMarkdownValue: shortDescSetMarkdownValue,
  } = useMarkdownEditor("");

  useEffect(() => {
    if (council && isSuccess) processData();
  }, [isSuccess]);

  async function processData() {
    setValue("name", council?.name);
    setValue("address", council?.address);
    await shortDescSetMarkdownValue(council?.description ?? "");
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
      await editCouncil.mutateAsync(saveData).then(() => {
        navigate(`/councils/${pageContext.routeParams!.id}`);
      });
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
      navigate("/snips");
    } catch (error) {
      // Handle error
      console.log(error);
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
                <MarkdownEditor
                  customEditor={shortDescEditor}
                  onChange={handleShortDescValue}
                  value={shortDescValue}
                  minHeight="120"
                  hideTabBar
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="statement">
                <FormLabel>Council statement</FormLabel>
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  customEditor={editor}
                />
                {errors.statement && <span>This field is required.</span>}
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
                <FormLabel>Multisig address</FormLabel>
                <Input
                  variant="primary"
                  placeholder="0x..."
                  {...register("address")}
                />
              </FormControl>

              <Flex justifyContent="flex-end" gap="16px">
                <Button
                  color="#D83E2C"
                  size="sm"
                  variant={"outline"}
                  mr="auto"
                  onClick={onOpenDelete}
                >
                  Delete
                </Button>
                <Button
                  as="a"
                  size="sm"
                  variant={"ghost"}
                  href={`/councils/${pageContext.routeParams!.id}`}
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
  title: "Snip / Create",
} satisfies DocumentProps;
