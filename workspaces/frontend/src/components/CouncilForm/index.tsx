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
  FormControlled,
  useFormErrorHandler,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { hasPermission } from "../../utils/helpers";
import { useForm, Controller } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { ethers } from "ethers";
import type { Space } from "@yukilabs/governance-backend/src/db/schema/councils";
import { usePageContext } from "../../renderer/PageContextProvider";
import { ROLES } from "../../renderer/types";

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
  } = useForm<RouterInput["councils"]["saveCouncil"]>({
    shouldFocusError: false,
  });

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const pageContext = usePageContext();

  const [members, setMembers] = useState<MemberType[]>([]);
  const { user } = usePageContext()
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

  const removeUserFromCouncil = (id: number) => {
    if (!council?.id) return;
    removeUserFromCouncilData.mutate({
      councilId: council?.id,
      id: id,
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
        address: member.address,
        name: member.name,
        twitterHandle: member.twitter,
        miniBio: member.miniBio,
        id: member?.id
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

  const onSubmitHandler = async (data) => {
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
  };

  const deleteCouncil = trpc.councils.deleteCouncil.useMutation();
  // Delete function
  const handleDeleteCouncil = async () => {
    if (!council?.id) return;

    try {
      await deleteCouncil.mutateAsync({ id: council.id, slug: council.slug });
      navigate("/");
      utils.councils.getAll.invalidate();
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const { setErrorRef, scrollToError } = useFormErrorHandler([
    "name",
    "description",
    "statement",
  ]);

  const onErrorSubmit = (errors) => {
    if (Object.keys(errors).length > 0) {
      scrollToError(errors);
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
      <form onSubmit={handleSubmit(onSubmitHandler, onErrorSubmit)} noValidate>
        <Stack spacing="standard.xl" direction={{ base: "column" }}>
          <FormControlled
            name="name"
            label="Council name"
            isRequired
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message || "Add council name"}
            ref={(ref) => setErrorRef("name", ref)}
          >
            <Input
              variant="primary"
              isInvalid={!!errors.name}
              size="standard"
              placeholder="Name"
              {...register("name", {
                required: true,
              })}
            />
          </FormControlled>

          <FormControlled
            name="description"
            ref={(ref) => setErrorRef("description", ref)}
            label="Short description"
            isRequired
            isInvalid={!!errors.description}
            errorMessage={
              errors.description?.message || "Add council description"
            }
          >
            <Controller
              name="description"
              control={control}
              rules={{
                validate: {
                  required: (value) => {
                    if (!shortDescValue) return "Add council description";
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
          </FormControlled>

          <FormControlled
            ref={(ref) => setErrorRef("statement", ref)}
            name="statement"
            label="Council statement"
            isRequired
            isInvalid={!!errors.statement}
            errorMessage={errors.statement?.message || "Add council statement"}
          >
            <Controller
              name="statement"
              control={control}
              defaultValue=""
              rules={{
                validate: {
                  required: (value) => {
                    const trimmedValue = editorValue?.trim();
                    if (!trimmedValue?.length) {
                      return "Add council statement";
                    }
                  },
                },
              }}
              render={({ field }) => (
                <MarkdownEditor
                  isInvalid={!!errors.statement}
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
          </FormControlled>

          <FormControl id="council-members">
            <MembersList
              members={members}
              setMembers={setMembers}
              editMode={mode === "edit"}
              removeUserFromCouncil={removeUserFromCouncil}
            />
          </FormControl>

          <FormControlled
            name="address"
            label="Multisig address"
            isInvalid={!!errors.address}
            errorMessage={
              errors.address?.message || "Invalid Ethereum address."
            }
          >
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
          </FormControlled>
          {mode === "create" ? (
            <Flex justifyContent="flex-end">
              <Button
                type="submit"
                variant="primary"
                width={{ base: "100%", md: "auto" }}
                size="standard"
              >
                Create council
              </Button>
            </Flex>
          ) : (
            <Flex justifyContent="flex-end" gap="16px">
              {hasPermission(user?.role, [
                ROLES.ADMIN,
                ROLES.SUPERADMIN,
                ROLES.MODERATOR,
              ]) ? (
                <Button
                  size="condensed"
                  variant="danger"
                  mr="auto"
                  onClick={onOpenDelete}
                >
                  Delete
                </Button>
              ) : null}
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
