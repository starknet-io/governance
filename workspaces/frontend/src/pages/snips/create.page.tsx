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

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["proposals"]["createSNIP"]>();
  const [editorValue, setEditorValue] = useState<string>(EditorTemplate.snip);
  const createSNIP = trpc.proposals.createSNIP.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      data.description = editorValue;
      await createSNIP.mutateAsync(data);
      navigate("/");
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
            Create SNIP Proposal
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
                {/* <Textarea
                  variant="primary"
                  placeholder="Enter your delegate statement here..."
                  {...register("description", {
                    required: true,
                  })}
                />
                {errors.description && <span>This field is required.</span>} */}
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
                <Select placeholder="Select option">
                  <option value="option1">Draft</option>
                  <option value="option2">Review</option>
                  <option value="option3">Last call</option>
                </Select>
              </FormControl>

              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Create SNIP
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
