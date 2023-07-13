import { DocumentProps } from "src/renderer/types";
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
  EditorTemplate,
  useMarkdownEditor,
  MarkdownEditor,
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
  } = useForm<RouterInput["snips"]["createSNIP"]>();

  const { editorValue, handleEditorChange } =
    useMarkdownEditor("Initial value");
  const createSNIP = trpc.snips.createSNIP.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.description = editorValue;
      await createSNIP.mutateAsync(data);
      navigate("/snips");
    } catch (error) {
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
                <MarkdownEditor
                  onChange={handleEditorChange}
                  value={editorValue}
                  initialValue={EditorTemplate.snip}
                />
                {errors.description && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="delegate-statement">
                <FormLabel>Discussion link</FormLabel>
                <Input
                  variant="primary"
                  placeholder="http://community.starknet.io/1234567890"
                  {...register("discussionURL")}
                />
              </FormControl>

              {/* // TODO: add category and status backend
               */}
              <FormControl id="category">
                <FormLabel>Category</FormLabel>
                <Select placeholder="Select option">
                  <option value="option1">category 1</option>
                  <option value="option2">category 2</option>
                  <option value="option3">category 3</option>
                </Select>
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
