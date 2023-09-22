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
  useMarkdownEditor,
  MarkdownEditor,
  MultiLevelReOrderableList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["savePage"]>();

  const savePagesTree = trpc.pages.savePagesTree.useMutation();
  const pagesTree = trpc.pages.getPagesTree.useQuery();

  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const { handleUpload } = useFileUpload();
  const { editorValue, handleEditorChange } = useMarkdownEditor("");

  const NEW_ITEM = {
    id: Date.now(),
    title: "This is the new page",
    content: editorValue,
    author: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderNumber: null,
    children: [],
    userId: "",
    slug: "",
  };

  useEffect(() => {
    if (pagesTree?.isSuccess && !treeItems.length) {
      setTreeItems([
        { id: Date.now(), data: NEW_ITEM, children: [], isNew: true },
        ...adaptTreeForFrontend(pagesTree.data),
      ]);
    }
  }, [pagesTree]);

  const saveChanges = handleSubmit((data) => {
    const newItems = flattenTreeItems(treeItems).map((item) => {
      if (item.isNew) {
        return {
          ...item,
          title: data.title,
          content: editorValue,
        };
      }
      return item;
    });

    savePagesTree.mutate(newItems, {
      onSuccess: () => {
        navigate(`/learn`);
      },
    });
  });

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create Page
          </Heading>
          <form>
            <Stack spacing="32px" direction={{ base: "column" }} mb="40px">
              <FormControl id="delegate-statement">
                <FormLabel>Title</FormLabel>
                <Input
                  variant="primary"
                  placeholder="Page title"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && <span>This field is required.</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Body</FormLabel>
                <MarkdownEditor
                  value={editorValue}
                  onChange={handleEditorChange}
                  handleUpload={handleUpload}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>
            </Stack>
          </form>

          {!!treeItems.length && (
            <Box mb="6">
              <Heading variant="h5" mb="24px">
                Page Order
              </Heading>
              <MultiLevelReOrderableList
                items={treeItems}
                setItems={setTreeItems}
              />
            </Box>
          )}

          <Flex justifyContent="flex-end">
            <Button
              size="condensed"
              variant="primary"
              isDisabled={!isValid}
              onClick={saveChanges}
              isLoading={savePagesTree.isLoading}
            >
              Save Changes
            </Button>
          </Flex>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Page / Create",
} satisfies DocumentProps;
