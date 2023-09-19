import { DocumentProps } from "src/renderer/types";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  ContentContainer,
  Button,
  MarkdownEditor,
  useMarkdownEditor,
  MultiLevelReOrderableList,
  Divider,
  Flex,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";

export function Page() {
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<RouterInput["pages"]["editPage"]>();

  const pageContext = usePageContext();
  const pageId = pageContext.routeParams!.id;

  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const { data: pagesTree, isSuccess } = trpc.pages.getPagesTree.useQuery();
  const savePagesTree = trpc.pages.savePagesTree.useMutation();
  const { mutateAsync: deletePage } = trpc.pages.deletePage.useMutation();

  const { editor, editorValue, handleEditorChange, setMarkdownValue } =
    useMarkdownEditor("");

  async function processData() {
    setTreeItems(adaptTreeForFrontend(pagesTree));
    const page = pagesTree?.find(
      (page: any) => page.id === Number(pageContext.routeParams!.id),
    );
    setValue("title", page?.title);
    await setMarkdownValue(page?.content ?? "");
  }

  useEffect(() => {
    if (isSuccess && pagesTree.length && !treeItems.length) {
      processData();
    }
  }, [isSuccess]);

  const onSubmit = handleSubmit(async (data) => {
    const updatedItems = flattenTreeItems(treeItems).map((item) => {
      if (item.id === +pageId) {
        return {
          ...item,
          title: data.title,
        };
      }
      return item;
    });

    try {
      savePagesTree.mutateAsync(updatedItems, {
        onSuccess: () => {
          navigate(`/learn`);
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  });

  const handleDeletePage = () => {
    deletePage({ id: +pageId }, {
      onSuccess: () => {
        navigate(`/learn`);
      },
    });
  };

  const handleClickCancel = () => {
    window.history.back();
  };

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Edit Page
          </Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing="32px" direction={{ base: "column" }} mb="40px">
              <FormControl id="pages">
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
                  customEditor={editor}
                  value={editorValue}
                  onChange={handleEditorChange}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>
            </Stack>
            {!!treeItems.length && (
              <Box>
                <Heading variant="h5" mb="24px">
                  Page Order
                </Heading>
                <MultiLevelReOrderableList
                  items={treeItems}
                  setItems={setTreeItems}
                />
              </Box>
            )}
            <Divider mt="14" mb="6" />
            <Flex justifyContent="space-between">
              <Button
                onClick={handleDeletePage}
                size="condensed"
                variant="danger"
              >
                Delete
              </Button>

              <Flex>
                <Button
                  onClick={handleClickCancel}
                  size="condensed"
                  variant="ghost"
                  mr="2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="condensed"
                  variant="primary"
                  // isDisabled={!isValid}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Page / Edit",
} satisfies DocumentProps;
