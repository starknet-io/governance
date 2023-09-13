import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  Modifier,
  defaultDropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  removeChildrenOf,
  setProperty,
} from "./utils";
import type { FlattenedItem, SensorContext, TreeItems } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { SortableTreeItem } from "./SortableTreeItem";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { Box } from "@chakra-ui/react";

const initialItems: TreeItems = [
  {
    id: "Home",
    data: { title: "one" },
    children: [],
  },
  {
    id: "Collections",
    data: { title: "two" },
    children: [
      { id: "Spring", data: { title: "" }, children: [] },
      { id: "Summer", data: { title: "" }, children: [] },
      { id: "Fall", data: { title: "" }, children: [] },
      { id: "Winter", data: { title: "" }, children: [] },
    ],
  },
  {
    id: "About Us",
    data: { title: "three" },
    children: [],
  },
  {
    id: "My Account",
    data: { title: "four" },
    children: [
      { id: "Addresses", data: { title: "" }, children: [] },
      { id: "Order History", data: { title: "" }, children: [] },
    ],
  },
];

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const MAXIMUM_ALLOWED_DEPTH = 3;

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface Props {
  items: TreeItems;
  indentationWidth?: number;
  removable?: boolean;
  onItemsChange?: (items: TreeItems) => void;
  setItems: Dispatch<SetStateAction<TreeItems>>;
}

export function MultiLevelReOrderableList({
  items = initialItems,
  indentationWidth = 7,
  removable,
  onItemsChange,
  setItems
}: Props) {
  // const [items, setItems] = useState(() => defaultItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        //@ts-expect-error error
        collapsed && children.length ? [...acc, id] : acc,
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      //@ts-expect-error error
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [activeId, items]);
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, false, indentationWidth),
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  return (
    <Box
      backgroundColor="white"
      boxShadow="sm"
      borderRadius="base"
      overflow="hidden"
      py="1"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={sortedIds}
          strategy={verticalListSortingStrategy}
        >
          {flattenedItems.map(({ id, depth, data }) => (
            <SortableTreeItem
              key={id}
              id={id}
              value={data}
              depth={id === activeId && projected ? projected.depth : depth}
              indentationWidth={indentationWidth}
              onRemove={removable ? () => handleRemove(id) : undefined}
            />
          ))}
          {createPortal(
            <DragOverlay
              dropAnimation={dropAnimationConfig}
            >
              {activeId && activeItem ? (
                <SortableTreeItem
                  id={activeId}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  value={activeItem.data}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
    </Box>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);
    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;

      //Maximum depth
      if (depth > MAXIMUM_ALLOWED_DEPTH - 1) return;

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
      onItemsChange?.(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    document.body.style.setProperty("cursor", "");
  }

  function handleRemove(id: UniqueIdentifier) {
    const updatedItems = removeItem(items, id);
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  }
}
