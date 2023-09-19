import {
  Box,
  Button,
  ContentContainer,
  Divider,
  Flex,
  Heading,
  MultiLevelReOrderableList,
} from "@yukilabs/governance-components";
import { TreeItems } from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import { useEffect, useState } from "react";
import { adaptTreeForFrontend, flattenTreeItems } from "src/utils/helpers";
import { trpc } from "src/utils/trpc";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
  const [treeItems, setTreeItems] = useState<TreeItems>([]);

  const { data } = trpc.pages.getPagesTree.useQuery();
  const { mutateAsync } = trpc.pages.savePagesTree.useMutation();

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
        navigate('/learn')
      },
    });
  };

  return (
    <ContentContainer>
      <Box width="100%" maxWidth="538px" pb="200px" mx="auto">
        <Heading variant="h3" mb="24px">
          Edit pages order
        </Heading>
        <Box>
          <MultiLevelReOrderableList
            items={treeItems}
            setItems={setTreeItems}
          />
        </Box>
        <Divider mt="14" mb="6" />
        <Flex justifyContent="space-between">
          <Button onClick={handleCancelClick} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSaveChangesClick}>Save changes</Button>
        </Flex>
      </Box>
    </ContentContainer>
  );
}
