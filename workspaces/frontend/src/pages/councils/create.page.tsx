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
  Switch,
  AddressList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";

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
  const [enableUpdate, setEnableUpdate] = useState(false);
  const [enableComments, setEnableComments] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([]);
  const createCouncil = trpc.councils.saveCouncil.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = statementValue;
      data.description = descriptionValue;
      data.enableUpdate = enableUpdate;
      data.enableComments = enableComments;
      data.slug = "";
      data.addresses = addresses;
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
                <AddressList
                  addresses={addresses}
                  setAddresses={setAddresses}
                />
              </FormControl>
              <Flex align="center">
                <FormControl id="enable-update" display="flex">
                  <FormLabel htmlFor="isChecked">
                    Enable update posts by council members
                  </FormLabel>
                  <Switch
                    id="isChecked"
                    size="md"
                    marginLeft="auto"
                    onChange={() => setEnableUpdate(!enableUpdate)}
                    isChecked={enableUpdate}
                  />
                </FormControl>
              </Flex>
              <Flex align="center">
                <FormControl id="enable-comments" display="flex">
                  <FormLabel htmlFor="isCommentChecked">
                    Enable community to post comments
                  </FormLabel>
                  <Switch
                    id="isCommentChecked"
                    size="md"
                    marginLeft="auto"
                    onChange={() => setEnableComments(!enableComments)}
                    isChecked={enableComments}
                  />
                </FormControl>
              </Flex>
              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  variant={"ghost"}
                  disabled={!isValid}
                  border="1px solid #E2E8F0"
                  borderRadius="none"
                >
                  Submit
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
