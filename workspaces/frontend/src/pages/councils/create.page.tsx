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
  QuillEditor,
  EditorTemplate,
  MembersList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["councils"]["saveCouncil"]>();
  const [statementValue, setStatementValue] = useState<string>(
    EditorTemplate.council
  );
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [members, setMembers] = useState<MemberType[]>([]);
  const createCouncil = trpc.councils.saveCouncil.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = statementValue;
      data.description = descriptionValue;
      data.slug = "";
      data.members = members;
      await createCouncil.mutateAsync(data);
      // navigate(/councils);
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
                  placeholder="Name"
                  {...register("name", {
                    required: true,
                  })}
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
                  placeholder="Briefly describe the councils purpose."
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
                <MembersList members={members} setMembers={setMembers} />
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
                <Button type="submit" variant={"solid"} disabled={!isValid}>
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
