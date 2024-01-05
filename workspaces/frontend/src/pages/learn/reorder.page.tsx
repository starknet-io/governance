import { PageWithChildren } from "@yukilabs/governance-backend/src/utils/buildLearnHierarchy";
import {
  Box,
  Button,
  ContentContainer,
  DeletionDialog,
  Divider,
  Flex,
  Heading,
  MultiLevelReOrderableList,
  Text,
} from "@yukilabs/governance-components";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { useEffect, useRef, useState } from "react";
import { FormLayout } from "#src/components/FormsCommon/FormLayout";
import { DocumentProps } from "#src/renderer/types";
import {
  adaptTreeForFrontend,
  flattenPageWithChildren,
  flattenTreeItems,
} from "#src/utils/helpers";
import { trpc } from "#src/utils/trpc";
import { navigate } from "vike/client/router";

export function Page() {
  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<PageWithChildren>();

  const ref = useRef(null);

  const { data, refetch } = trpc.pages.getPagesTree.useQuery();
  const { mutateAsync, isLoading } = trpc.pages.savePagesTree.useMutation();
  const { mutateAsync: deletePage, isLoading: isDeleting } =
    trpc.pages.deletePage.useMutation();

  const pagesTree = data ?? [];

  useEffect(() => {
    if (pagesTree?.length && !treeItems.length) {
      setTreeItems(adaptTreeForFrontend(pagesTree));
    }
  }, [pagesTree]);

  const handleCancelClick = () => {
    window.history.back();
  };

  const handleSaveChangesClick = () => {
    mutateAsync(flattenTreeItems(treeItems), {
      onSuccess: () => {
        navigate("/learn");
      },
    });
  };

  const handlePreConfirmDeleteItem = (id: number) => {
    const flatItems = flattenTreeItems(treeItems);
    const item = flatItems.find((item) => item.id === id);
    const children = flattenPageWithChildren([item!]);
    setItemToDelete({ ...item!, children });
    setIsConfirmDeleteModalVisible(true);
  };

  const handleDeleteItem = () => {
    setIsConfirmDeleteModalVisible(false);
    itemToDelete?.id &&
      deletePage(
        { id: itemToDelete?.id },
        {
          onSuccess: async () => {
            setItemToDelete(undefined);
            const { data: updatedTreeItems } = await refetch();
            setTreeItems(adaptTreeForFrontend(updatedTreeItems));
          },
        },
      );
  };

  return (
    <FormLayout>
      <Heading variant="h3" mb="24px">
        Edit pages order
      </Heading>
      <Box>
        <MultiLevelReOrderableList
          items={treeItems}
          setItems={setTreeItems}
          onItemDeleteClick={handlePreConfirmDeleteItem}
        />
      </Box>
      <Divider mt="14" mb="6" />
      <Flex justifyContent="space-between">
        <Button onClick={handleCancelClick} variant="ghost">
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={handleSaveChangesClick}>
          Save changes
        </Button>
      </Flex>

      <DeletionDialog
        customTitle="This page include these articles inside.
      If you delete it, you also delete following articles:"
        customDeleteTitle="Delete"
        onClose={() => setIsConfirmDeleteModalVisible(false)}
        onDelete={handleDeleteItem}
        isOpen={isConfirmDeleteModalVisible}
        cancelRef={ref}
      >
        <Box px="6">
          <Box pl="6">
            <ul>
              {itemToDelete?.children.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </Box>

          <Text fontSize="sm" mt="6">
            Are you sure that you want delete this page?
          </Text>
        </Box>
      </DeletionDialog>
    </FormLayout>
  );
}

export const documentProps = {
  title: "Learn / Reorder",
  image: "/social/social-learn.png",
} satisfies DocumentProps;
