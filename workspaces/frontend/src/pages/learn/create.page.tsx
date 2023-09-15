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
  ReorderableList,
  useMarkdownEditor,
  MarkdownEditor,
  MultiLevelReOrderableList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { PageWithUserInterface } from "./index.page";
import {
  TreeItem,
  TreeItems,
} from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";

export function Page() {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["savePage"]>();
  // const [editorValue, setEditorValue] = useState<string>("");
  const title = watch("title", "");
  const saveBatchPages = trpc.pages.saveBatch.useMutation();
  const pagesResponse = trpc.pages.getAll.useQuery();

  const savePagesTree = trpc.pages.savePagesTree.useMutation();

  const pages = pagesResponse.data ?? [];

  const [treeItems, setTreeItems] = useState<TreeItems>([]);

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

  // useEffect(() => {
  //   setReorderItems((prevItems) => {
  //     const itemMap = new Map(prevItems.map((item) => [item.id, item]));
  //     for (const page of pages) {
  //       if (!itemMap.has(page.id)) {
  //         itemMap.set(page.id, page);
  //       }
  //     }
  //     return Array.from(itemMap.values());
  //   });
  // }, [pages]);

  // useEffect(() => {
  //   setReorderItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === 0
  //         ? {
  //             ...item,
  //             title: title || "This is the new page",
  //             content: editorValue,
  //           }
  //         : item,
  //     ),
  //   );
  // }, [title, editorValue]);

  const pagesTree = trpc.pages.getPagesTree.useQuery();
  // console.log({ TREE: pagesTree.data });

  useEffect(() => {
    if (pagesTree?.data?.length && !treeItems.length) {
      setTreeItems(adaptTreeForFrontend(pagesTree.data));
    }
  }, [pages]);

  const handleAddNewItem = () => {
    setTreeItems((treeItems) => [
      { id: Date.now(), data: NEW_ITEM, children: [], isNew: true },
      ...treeItems,
    ]);
  };

  const saveChanges = () => {
    savePagesTree.mutate(flattenTreeItems(treeItems), {
      onSuccess: (d) => {
        console.log({ CHECK: d });
        //  navigate(`/learn`);
      },
    });
  };

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
              // isDisabled={!isValid}
              onClick={saveChanges}
            >
              Save Changes
            </Button>

            <Button
              size="condensed"
              variant="primary"
              // isDisabled={!isValid}
              onClick={handleAddNewItem}
            >
              Add new item
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
