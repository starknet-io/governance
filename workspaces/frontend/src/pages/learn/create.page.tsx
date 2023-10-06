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
  Banner,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";

export function Page() {
  const {
    handleSubmit,
    register,
    control,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["savePage"]>();

  const savePagesTree = trpc.pages.savePagesTree.useMutation();
  const pagesTree = trpc.pages.getPagesTree.useQuery();

  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const [error, setError] = useState("");
  const { handleUpload } = useFileUpload();
  const { editorValue, handleEditorChange } = useMarkdownEditor("");

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
      onError: (err) => {
        setError(err?.message || "An Error Occurred");
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
                {errors.title && <span>Add article name</span>}
              </FormControl>
              <FormControl id="proposal-body">
                <FormLabel>Council statement</FormLabel>
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
          {error.length ? (
            <Banner label={error} variant="error" type="error" />
          ) : null}
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Learn / Create",
} satisfies DocumentProps;
