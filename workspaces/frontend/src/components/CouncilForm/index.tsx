import { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  MembersList,
  MarkdownEditor,
  useMarkdownEditor,
  Textarea,
  Banner,
  useDisclosure,
  DeletionDialog,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm, Controller } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { ethers } from "ethers";
import type { Space } from "@yukilabs/governance-backend/src/db/schema/councils";
import { usePageContext } from "../../renderer/PageContextProvider";

interface CouncilFormProps {
  mode: "create" | "edit";
  council?: Space;
  isFetchingCouncilSuccess?: boolean;
}

export function CouncilForm({
  mode,
  council,
  isFetchingCouncilSuccess,
}: CouncilFormProps) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    trigger,
    setValue,
  } = useForm<RouterInput["councils"]["saveCouncil"]>();

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const pageContext = usePageContext();

  const [members, setMembers] = useState<MemberType[]>([]);
  const [error, setError] = useState<string>("");
  const createCouncil = trpc.councils.saveCouncil.useMutation();
  const editCouncil = trpc.councils.editCouncil.useMutation();
  const { handleUpload } = useFileUpload();
  const utils = trpc.useContext();
  const { editorValue, handleEditorChange, editor, setMarkdownValue } =
    useMarkdownEditor("");
  const [shortDescValue, setShortDescValue] = useState("");
  const cancelRef = useRef(null);

  const removeUserFromCouncilData =
    trpc.councils.deleteUserFromCouncil.useMutation();

  const removeUserFromCouncil = (address: string) => {
    if (!council?.id) return;
    removeUserFromCouncilData.mutate({
      councilId: council?.id,
      userAddress: address,
    });
  };

  useEffect(() => {
    if (mode === "edit") {
      if (council && isFetchingCouncilSuccess) processData();
    }
  }, [isFetchingCouncilSuccess, mode]);

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
      if (mode === "edit") {
        data.id = council!.id;
      }
      data.members = members;
      const mutation = mode === "create" ? createCouncil : editCouncil;

      await mutation.mutateAsync(data, {
        onSuccess: (res) => {
          utils.councils.getAll.invalidate();
          if (mode === "edit") {
            utils.councils.getCouncilBySlug.invalidate();
          }
          navigate(`/councils/${res.slug}`);
        },
      });
    } catch (error) {
      // Handle error
      setError(`Error: ${error?.message}` || "An Error occurred");
    }
  });

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

  return (
    <>
      <DeletionDialog
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onDelete={handleDeleteCouncil}
        cancelRef={cancelRef}
        entityName="Council"
      />
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
            <Controller
              name="description"
              control={control}
              rules={{
                validate: {
                  required: (value) => {
                    if (!shortDescValue || !shortDescValue)
                      return "Add council description";
                  },
                },
              }}
              render={({ field }) => (
                <Textarea
                  variant="primary"
                  name="description"
                  maxLength={280}
                  placeholder="Short description"
                  rows={4}
                  focusBorderColor={"#292932"}
                  resize="none"
                  value={shortDescValue}
                  onChange={(e) => setShortDescValue(e.target.value)}
                />
              )}
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
            <MembersList
              members={members}
              setMembers={setMembers}
              editMode={mode === "edit"}
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
          {mode === "create" ? (
            <Flex justifyContent="flex-end">
              <Button type="submit" variant="primary">
                Create council
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
                href={`/councils/${pageContext.routeParams!.id}`}
              >
                Cancel
              </Button>
              <Button type="submit" size="condensed" variant="primary">
                Save
              </Button>
            </Flex>
          )}

          {error && error.length && (
            <Banner label={error} variant="error" type="error" />
          )}
        </Stack>
      </form>
    </>
  );
}

export default CouncilForm;
