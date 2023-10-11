import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  useMarkdownEditor,
  MarkdownEditor,
  MultiLevelReOrderableList,
  Banner,
  Divider,
  DeletionDialog,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";
import { usePageContext } from "../../renderer/PageContextProvider";
import type { Page } from "@yukilabs/governance-backend/src/db/schema/pages";

type LearnFormProps = {
  mode: "create" | "edit";
};

export function LearnForm({ mode }: LearnFormProps) {
  const {
    handleSubmit,
    register,
    control,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["savePage"]>();
  const { mutateAsync: deletePage } = trpc.pages.deletePage.useMutation();
  const cancelRef = useRef(null);

  const savePagesTree = trpc.pages.savePagesTree.useMutation();
  const pagesTree = trpc.pages.getPagesTree.useQuery();

  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const [error, setError] = useState("");
  const { editorValue, handleEditorChange, setMarkdownValue, editor } =
    useMarkdownEditor("");
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const pageContext = usePageContext();
  const { handleUpload } = useFileUpload();
  const pageId = pageContext.routeParams!.id;
  const handleClickCancel = () => {
    window.history.back();
  };

  const title = watch("title");
  const NEW_ITEM_ID = Date.now();
  const NEW_ITEM = {
    id: NEW_ITEM_ID,
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
    if (pagesTree?.isSuccess && !treeItems.length && mode === "create") {
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
      } else if (item.id === +pageId) {
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
      onError: (err) => {
        setError(err?.message || "An Error Occurred");
      },
    });
  });

  const handleDeletePage = () => {
    setIsDeleteDialogVisible(true);
    deletePage(
      { id: +pageId },
      {
        onSuccess: () => {
          navigate(`/learn`);
        },
        onError: (err) => {
          setError(err?.message || "An error occurred");
        },
      },
    );
  };

  async function processData() {
    setTreeItems(adaptTreeForFrontend(pagesTree.data));
    const page = flattenTreeItems(adaptTreeForFrontend(pagesTree.data))?.find(
      (page: any) => page.id === Number(pageContext.routeParams!.id),
    );
    setValue("title", page?.title);
    await setMarkdownValue(page?.content ?? "");
  }

  useEffect(() => {
    if (mode === "edit" && pagesTree?.isSuccess) {
      if (pagesTree?.data?.length && !treeItems.length) {
        processData();
      }
    }
  }, [mode, pagesTree?.isSuccess]);

  return (
    <>
      <DeletionDialog
        isOpen={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onDelete={handleDeletePage}
        cancelRef={cancelRef}
        customTitle="Are you sure that you want delete this page?"
        customDeleteTitle="Delete"
        entityName="Page"
      />
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
            {errors.title && <span>Add article name</span>}
          </FormControl>
          <FormControl id="proposal-body">
            <FormLabel>Body</FormLabel>
            <Controller
              name="content"
              control={control} // control comes from useForm()
              defaultValue=""
              rules={{
                validate: {
                  required: (value) => {
                    // Trim the editorValue to remove spaces and new lines
                    const trimmedValue = editorValue?.trim();

                    if (!trimmedValue?.length || !trimmedValue) {
                      return "Add article text";
                    }
                  },
                },
              }}
              render={({ field }) => (
                <MarkdownEditor
                  value={editorValue}
                  customEditor={editor}
                  onChange={(val) => {
                    handleEditorChange(val);
                    field.onChange(val);
                    if (errors.content) {
                      trigger("content");
                    }
                  }}
                  handleUpload={handleUpload}
                  offsetPlaceholder={"-8px"}
                  placeholder={`
Type here...`}
                />
              )}
            />
            {errors.content && <span>{errors.content.message}</span>}
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
      {mode === "create" ? (
        <Flex justifyContent="flex-end" mb={4}>
          <Button
            size="condensed"
            variant="primary"
            onClick={saveChanges}
            isLoading={savePagesTree.isLoading}
          >
            Save Changes
          </Button>
        </Flex>
      ) : (
        <>
          <Divider mt="14" mb="6" />
          <Flex justifyContent="space-between" mb={4}>
            <Button
              onClick={() => setIsDeleteDialogVisible(true)}
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
                onClick={saveChanges}
                isLoading={savePagesTree.isLoading}
                // isDisabled={!isValid}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </>
      )}
      {error.length ? (
        <Banner label={error} variant="error" type="error" />
      ) : null}
    </>
  );
}

export default LearnForm;
