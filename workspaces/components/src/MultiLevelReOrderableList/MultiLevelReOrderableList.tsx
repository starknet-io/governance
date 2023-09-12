import React, { useState, forwardRef } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactSortable } from "react-sortablejs";

import {
  SortableTree,
  SimpleTreeItemWrapper,
  TreeItemComponentProps,
} from "dnd-kit-sortable-tree";

import { DragHoldIcon } from "./icon";

const DUMMY_DATA: any[] = [
  {
    id: 1,
    type: "container",
    title: "Main page",
    subPages: [
      {
        id: 4,
        type: "item",
        title: "About main page",
        subPages: [],
      },
    ],
  },
  {
    id: 2,
    type: "container",
    title: "Crypto page",
    subPages: [
      {
        id: 5,
        type: "item",
        title: "About crypto page",
        subPages: [],
      },
    ],
  },
  { id: 3, type: "container", title: "Career page", subPages: [] },
];

//Sortable options
const SORTABLE_OPTIONS = {
  animation: 200,
  fallbackOnBody: true,
  swapThreshold: 0.7,
  group: "shared",
};

// export function MultiLevelReOrderableList() {
//   const [allItems, setAllItems] = useState(DUMMY_DATA);

//   // console.log({ allItems });

//   return (
//     <Box>
//       <ReactSortable
//         list={allItems}
//         setList={setAllItems}
//         onRemove={(e) => console.log({ checkHere: e })}
//         {...SORTABLE_OPTIONS}
//       >
//         {!!allItems.length &&
//           allItems.map((item, itemIndex) => (
//             <DragItem
//               key={item.id}
//               item={item}
//               itemsState={allItems}
//               itemIndex={[itemIndex]}
//               setItems={setAllItems}
//             />
//           ))}
//       </ReactSortable>
//     </Box>
//   );
// }

function Container({
  item,
  itemsState,
  itemIndex,
  setItems,
  group = "shared",
}: {
  item: any;
  itemsState: any;
  itemIndex: any;
  setItems: any;
  group?: string;
}) {
  const setList = (currentList: any) => {
    const clone = [...itemsState];
    const dragIds = [...itemIndex];

    console.log({ dragIds });
    const lastIndex = dragIds.pop();
    const lastArr = dragIds.reduce((arr, i) => arr[i]["subPages"], clone);

    const currentParentContainer = lastArr[lastIndex];

    console.log({ currentList });
    console.log({ currentParentContainer });
    console.log({ itemsState });

    currentParentContainer["subPages"] = currentList.map((item: any) => {
      return {
        ...item,
        type: "item",
        // currentParentContainer.type === "container"
        //   ? "sub-container"
        //   : "item",
      };
    });

    // console.log({ clone });
    // console.log({ itemIndex });

    const items = [
      ...clone.map((parent: any) => ({ ...parent, type: "container" })),
      // ...currentList,
    ];

    setItems(items);
  };

  return (
    <ReactSortable
      key={item.id}
      list={item.subPages}
      setList={setList}
      {...{ ...SORTABLE_OPTIONS, group }}
    >
      {item.subPages &&
        item.subPages.map((childItem: any, index: any) => {
          return (
            <DragItem
              itemsState={itemsState}
              key={childItem.id}
              item={childItem}
              itemIndex={[...itemIndex, index]}
              setItems={setItems}
            />
          );
        })}
    </ReactSortable>
  );
}

function DragItem({
  item,
  itemsState,
  itemIndex,
  setItems,
}: {
  item: any;
  itemsState: any;
  itemIndex: any;
  setItems: any;
}) {
  //If there is no items
  if (!item) return null;

  //If the item is the parent page that holds sub-pages
  if (item.type === "container" || item.type === "sub-container") {
    return (
      <Box
        backgroundColor="white"
        p="3"
        mb="2"
        borderRadius="base"
        border="1px solid rgba(35, 25, 45, 0.10)"
        boxShadow="sm"
      >
        <Flex height="9" alignItems="center">
          <Box>
            <DragHoldIcon />
          </Box>
          <Text fontSize="sm" fontWeight="medium">
            {item.title}
          </Text>
        </Flex>
        <Box
          ml="5"
          pl="2"
          mt={item?.subPage?.length > 0 ? "1.5" : "0"}
          borderLeft="1px solid #DCDBDD"
        >
          <Container
            item={item}
            itemsState={itemsState}
            itemIndex={itemIndex}
            setItems={setItems}
          />
        </Box>
      </Box>
    );
  }

  //If item is a sub-page
  return (
    <Flex height="9" alignItems="center">
      <Box>
        <DragHoldIcon />
      </Box>
      <Text fontWeight="medium" color="#4A4A4F" fontSize="xs">
        {item.title}
      </Text>
    </Flex>
  );
}

// const initialMinimalData = [
//   { id: "4", value: "one" },
//   { id: "5", value: "twp" },
//   { id: "1", value: "Main" },
//   { id: "2", value: "Sub-main" },
//   { id: "3", value: "Sub-sub-main" },
// ];

// // eslint-disable-next-line react/display-name
// const MinimalTreeItemComponent = forwardRef<
//   HTMLDivElement,
//   TreeItemComponentProps<any>
// >((props, ref) => {
//   /* you could also use FolderTreeItemWrapper if you want to show vertical lines.  */
//   console.log(props.depth);
//   return (
//     <SimpleTreeItemWrapper {...props} ref={ref}>
//       <div>{props.item.value}</div>
//     </SimpleTreeItemWrapper>
//   );
// });

// export function MultiLevelReOrderableList() {
//   const [items, setItems] = useState(initialMinimalData);
//   return (
//     <SortableTree
//       items={items}
//       onItemsChanged={setItems}
//       {
//         /*
//          * You need to pass the component rendering a single item via TreeItemComponent props.
//          * This component will receive the data via `props.item`.
//          * In this example we inline the component, but in reality you should extract it into a const.
//          */ ...{
//           indentationWidth: 32,
//           dndContextProps: {

//           },
//           canRootHaveChildren: () => false
//         }        
//       }
//       TreeItemComponent={MinimalTreeItemComponent}
//     />
//   );
// }

export { MultiLevelReOrderableList } from './Tree';