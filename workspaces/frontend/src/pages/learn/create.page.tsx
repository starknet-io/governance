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
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { Reorder } from "framer-motion";
import { PageWithUserInterface } from "./index.page";

export function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["savePage"]>();
  const [editorValue, setEditorValue] = useState<string>("");
  const createPage = trpc.pages.savePage.useMutation();
  const saveBatchPages = trpc.pages.saveBatch.useMutation();
  const pagesResponse = trpc.pages.getAll.useQuery();
  const pages = pagesResponse.data ?? [];
  const [reorderItems, setReorderItems] = useState<PageWithUserInterface[]>([]);

  useEffect(() => {
    if (pages.length > 0) {
      setReorderItems((prevItems) => {
        const itemMap = new Map(prevItems.map((item) => [item.id, item]));
        for (const page of pages) {
          if (!itemMap.has(page.id)) {
            itemMap.set(page.id, page);
          }
        }
        return Array.from(itemMap.values());
      });
    }
  }, [pages]);

  const addPage = handleSubmit(async (data) => {
    const newPage: PageWithUserInterface = {
      id: 0,
      title: data.title ?? "",
      content: editorValue,
      userId: "",
      orderNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: null,
    };
    setReorderItems([...reorderItems, newPage]);
    // try {
    //   data.content = editorValue;
    //   await createPage.mutateAsync(data, {
    //     onSuccess: () => {
    //       navigate(`/learn`);
    //     },
    //   });
    // } catch (error) {
    //   // Handle error
    //   console.log(error);
    // }
  });

  const saveChanges = () => {
    console.log("reorderItems: ", reorderItems);
    saveBatchPages.mutateAsync(reorderItems, {
      onSuccess: () => {
        navigate(`/learn`);
      },
    });
  };

  const setItems = (values: any) => {
    console.log(values);
    setReorderItems(values);
  };

  return (
    <>
      <ContentContainer>
        <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
          <Heading variant="h3" mb="24px">
            Create Page
          </Heading>
          <form onSubmit={addPage}>
            <Stack spacing="32px" direction={{ base: "column" }}>
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
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>

              <Flex justifyContent="flex-end" mb="2rem">
                <Button
                  type="submit"
                  size="sm"
                  variant={"solid"}
                  disabled={!isValid}
                >
                  Add Page
                </Button>
              </Flex>
            </Stack>
          </form>
          <Reorder.Group axis="y" values={reorderItems} onReorder={setItems}>
            {reorderItems?.map((page) => (
              <Reorder.Item key={page.id} value={page}>
                <Box
                  p="4"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mb="4"
                >
                  {page.title}
                </Box>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <Flex justifyContent="flex-end">
            <Button
              size="sm"
              variant={"solid"}
              disabled={!isValid}
              onClick={saveChanges}
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
