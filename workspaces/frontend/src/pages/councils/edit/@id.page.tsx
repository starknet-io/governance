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
  QuillEditor,
  EditorTemplate,
  MembersList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";

export function Page() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();
  const [statementValue, setStatementValue] = useState<string>(
    EditorTemplate.council
  );
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [members, setMembers] = useState<MemberType[]>([]);
  const editCouncil = trpc.councils.editCouncil.useMutation();
  const pageContext = usePageContext();
  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });
  const removeUserFromCouncilData =
    trpc.councils.deleteUserFromCouncil.useMutation();

  const { data: council } = councilResp;

  useEffect(() => {
    if (council) {
      setValue("name", council.name);
      setValue("address", council.address);
      setDescriptionValue(council.description ?? "");
      setStatementValue(council.statement ?? "");
      const tempMembers = council.members?.map((member) => {
        return {
          address: member.user.address,
          name: member.user.name,
          twitterHandle: member.user.twitter,
          miniBio: member.user.miniBio,
        };
      });
      setMembers(tempMembers ?? []);
    }
  }, [council]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = statementValue;
      data.description = descriptionValue;
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

  return (
    <>
      <ContentContainer>
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
                <QuillEditor
                  onChange={(e) => setDescriptionValue(e)}
                  value={descriptionValue}
                  maxLength={250}
                  noToolbar
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>

              <FormControl id="statement">
                <FormLabel>Council statement</FormLabel>
                <QuillEditor
                  onChange={(e) => setStatementValue(e)}
                  value={statementValue}
                  maxLength={10000}
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

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Edit
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
