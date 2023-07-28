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
  Select,
  Flex,
  ContentContainer,
  QuillEditor,
  EditorTemplate,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "../../../renderer/PageContextProvider";

export function Page() {
  const pageContext = usePageContext();
  const snip = trpc.snips.getSNIP.useQuery({
    id: parseInt(pageContext.routeParams!.id),
  });
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<RouterInput["snips"]["createSNIP"]>();
  const [editorValue, setEditorValue] = useState<string>(EditorTemplate.snip);
  const updateSNIP = trpc.snips.editSNIP.useMutation();

  useEffect(() => {
    if (snip.data) {
      setValue("title", snip.data.title);
      setValue("discussionURL", snip.data.discussionURL);
      setValue("status", snip.data.status);
      setEditorValue(snip.data.description);
    }
  }, [snip.data, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.description = editorValue;
      data.id = parseInt(pageContext.routeParams!.id)
      await updateSNIP.mutateAsync(data);
      navigate(`/snips/${parseInt(pageContext.routeParams!.id)}`);
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
            Edit SNIP Proposal
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }}>
              <FormControl id="delegate-statement">
                <FormLabel>Title</FormLabel>
                <Input
                  variant="primary"
                  placeholder="SNIP title"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Proposal Body</FormLabel>
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="delegate-statement">
                <FormLabel>Forum discussion(optional)</FormLabel>
                <Input
                  variant="primary"
                  placeholder="http://community.starknet.io/1234567890"
                  {...register("discussionURL")}
                />
              </FormControl>
              <FormControl id="starknet-type">
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Select option"
                  {...register("status", { required: true })}
                >
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Last Call">Last call</option>
                </Select>
                {errors.status && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Update SNIP
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
  title: "Snip / Edit",
} satisfies DocumentProps;
