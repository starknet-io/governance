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
  Switch,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";

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
  const editCouncil = trpc.councils.editCouncil.useMutation();
  const pageContext = usePageContext();
  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });

  const { data: council } = councilResp;

  useEffect(() => {
    if (council) {
      setDescriptionValue(council.description ?? "");
      setStatementValue(council.statement ?? "");
    }
  }, [council]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.statement = statementValue;
      data.description = descriptionValue;
      const saveData = {
        ...data,
        id: parseInt(pageContext.routeParams!.id),
      };
      await editCouncil.mutateAsync(saveData).then(() => {
        navigate(`/councils/${pageContext.routeParams!.id}`);
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
