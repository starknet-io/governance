import { PageWithChildren } from "@yukilabs/governance-backend/src/utils/buildLearnHierarchy";
import {
  TreeItem,
  TreeItems,
} from "@yukilabs/governance-components/src/MultiLevelReOrderableList/types";
import {
  getChecksumAddress,
  validateAndParseAddress,
  validateChecksumAddress,
} from "starknet";
import { WalletChain } from "./constants";

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

export const validateStarknetAddress = (address: string) => {
  if (!address) return true;
  try {
    const parsedAddress = validateAndParseAddress(address);
    const checksumAddress = getChecksumAddress(parsedAddress);
    const isChecksumValid = validateChecksumAddress(checksumAddress);
    return isChecksumValid;
  } catch (error) {
    return false;
  }
};

export const validateEmailAddress = (address: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(address);
};

export function formatSlug(slug: string): string {
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function extractAndFormatSlug(
  url: string,
  segment = "councils",
): string {
  const segments = url.split("/");
  const index = segments.indexOf(segment);
  const slug = segments[index + 1];

  return formatSlug(slug);
}

export const findMatchingWallet = (wallets: any[], key: "EVM" | "STARKNET") => {
  return wallets.find((wallet) => wallet.chain === WalletChain[key]);
};

export const formatVotingPower = (votingPowerReceived: any) => {
  if (!votingPowerReceived || isNaN(votingPowerReceived)) {
    return 0;
  }
  const votingPower = parseFloat(votingPowerReceived?.toString());
  if (votingPower < 0.1) {
    return votingPower.toFixed(5);
  } else {
    return votingPower.toFixed(2);
  }
};
