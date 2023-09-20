import { PageWithChildren } from "@yukilabs/governance-backend/src/utils/buildLearnHierarchy";
import {
  TreeItem,
  TreeItems,
} from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";

export type PageDnD = {
  id: number;
  data: PageWithChildren;
  children: PageDnD[];
};

export const hasPermission = (
  userRole: string | undefined,
  allowedRoles: string[],
) => {
  if (!userRole) {
    return false;
  }
  return allowedRoles.includes(userRole);
};

export function flattenTreeItems(items: TreeItems) {
  const flattenedItems: PageWithChildren[] = [];

  function recursive(item: TreeItem, parent: number | null = null) {
    const flattenedItem = {
      ...(item.data as PageWithChildren),
      parentId: parent,
      orderNumber: flattenedItems.length + 1,
      isNew: item.isNew,
    };
    flattenedItems.push(flattenedItem);

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        recursive(child, item.data.id);
      });
    }
  }

  items.forEach((item) => {
    recursive(item, null);
  });

  return flattenedItems;
}

export function flattenPageWithChildren(pages: PageWithChildren[]) {
  const result: PageWithChildren[] = [];

  function recursiveFlatten(arr: PageWithChildren[]) {
    for (const item of arr) {
      result.push(item);
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        recursiveFlatten(item.children);
      }
    }
  }

  recursiveFlatten(pages);

  return result;
}

export function adaptTreeForFrontend(
  items: PageWithChildren[] = [],
): PageDnD[] {
  return items?.map((page) => ({
    id: page.id,
    data: page,
    children: page?.children?.length
      ? adaptTreeForFrontend(page?.children)
      : [],
  }));
}
