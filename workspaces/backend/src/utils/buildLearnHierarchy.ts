import { Page } from '../db/schema/pages';

export type PageWithChildren = Page & { children: PageWithChildren[], isNew?: boolean };

export function buildLearnItemsHierarchy(items: Page[]) {
  const pages: PageWithChildren[] = items.map((i) => ({ ...i, children: [] }));

  const itemMap = new Map();
  const rootItems = [];

  for (const item of pages) {
    item.children = [];
    itemMap.set(item.id, item);
  }

  pages.sort((a, b) => a.orderNumber! - b.orderNumber!);

  for (const item of pages) {
    const parentId = item.parentId;
    if (parentId === null) {
      rootItems.push(item);
    } else {
      const parentItem = itemMap.get(parentId);
      if (parentItem) {
        parentItem.children.push(item);
      }
    }
  }

  return rootItems;
}
