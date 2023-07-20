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
  QuillEditor,
  ReorderableList,
  Button,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useForm } from "react-hook-form";
import { RouterInput } from "@yukilabs/governance-backend/src/routers";
import { navigate } from "vite-plugin-ssr/client/router";
import { usePageContext } from "src/renderer/PageContextProvider";
import { PageWithUserInterface } from "../index.page";

export function Page() {
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<RouterInput["pages"]["editPage"]>();
  const pageContext = usePageContext();
  const pagesResponse = trpc.pages.getAll.useQuery();
  const saveBatchPages = trpc.pages.saveBatch.useMutation();
  const [editorValue, setEditorValue] = useState<string>("");
  const pages = pagesResponse.data ?? [];
  const [reorderItems, setReorderItems] = useState<PageWithUserInterface[]>([]);
  const title = watch("title");

  useEffect(() => {
    if (pages) {
      const page = pages.find(
        (page) => page.id === Number(pageContext.routeParams!.id)
      );
      setValue("title", page?.title);
      setEditorValue(page?.content ?? "");
      setReorderItems(pages);
    }
  }, [pages]);

  useEffect(() => {
    setReorderItems((prevItems) => {
      const itemIndex = prevItems.findIndex(
        (item) => item.id === Number(pageContext.routeParams!.id)
      );
      if (itemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          title: title ?? "",
          content: editorValue,
        };
        return updatedItems;
      }
      return prevItems;
    });
  }, [title, editorValue]);

  const setItems = (values: any) => {
    setReorderItems(values);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      saveBatchPages.mutateAsync(reorderItems, {
        onSuccess: () => {
          navigate(`/learn`);
        },
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
            Edit council
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
                <QuillEditor
                  onChange={(e) => setEditorValue(e)}
                  value={editorValue}
                />
                {errors.content && <span>This field is required.</span>}
              </FormControl>
            </Stack>
            <Heading variant="h5" mb="24px">
              Page Order
            </Heading>
            <ReorderableList items={reorderItems} setItems={setItems} />
            <Button
              type="submit"
              size="sm"
              variant={"solid"}
              disabled={!isValid}
            >
              Save
            </Button>
          </form>
        </Box>
      </ContentContainer>
    </>
  );
}

export const documentProps = {
  title: "Page / Edit",
} satisfies DocumentProps;
