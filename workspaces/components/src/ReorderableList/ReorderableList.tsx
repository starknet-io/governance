import { Reorder, useDragControls } from "framer-motion";
import { Box } from "@yukilabs/governance-components";
import React from "react";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { Page } from "@yukilabs/governance-backend/src/db/schema/pages";
import "./list.css";
import { ReorderIcon } from "./icon";

interface PageWithUserInterface extends Page {
  author: User | null;
}

interface ReorderableListProps {
  items: PageWithUserInterface[];
  setItems: (values: PageWithUserInterface[]) => void;
}

export const ReorderableList: React.FC<ReorderableListProps> = ({
  items,
  setItems,
}) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="reorderable-list"
    >
      {items?.map((page) => (
        <Reorder.Item key={page.id} value={page} dragControls={dragControls}>
          <Box
            className="list-item"
            padding={"10px"}
            borderBottom="1px solid"
            borderColor="gray.200"
            position="relative"
            pl="40px"
          >
            <ReorderIcon dragControls={dragControls} />
            {page.title}
          </Box>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
