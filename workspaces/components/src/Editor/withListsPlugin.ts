import { withLists } from "@prezly/slate-lists";
import { Element } from "slate";
import { ListType } from '@prezly/slate-lists';

export enum Type {
    PARAGRAPH = 'paragraph',
    // ORDERED_LIST = 'ordered-list',
    // UNORDERED_LIST = 'unordered-list',
    ORDERED_LIST = 'ol_list',
    UNORDERED_LIST = 'ul_list',
    LIST_ITEM = 'list_item',
    LIST_ITEM_TEXT = 'list-item-text',
}

export const withListsPlugin = withLists({
    isConvertibleToListTextNode(node: Node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isDefaultTextNode(node: Node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isListNode(node: Node, type?: ListType) {
        if (type) {
            const nodeType =
                type === ListType.ORDERED_LIST ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
            return Element.isElementType(node, nodeType);
        }
        return (
            Element.isElementType(node, Type.ORDERED_LIST) ||
            Element.isElementType(node, Type.UNORDERED_LIST)
        );
    },
    isListItemNode(node: Node) {
        return Element.isElementType(node, Type.LIST_ITEM);
    },
    isListItemTextNode(node: Node) {
        return Element.isElementType(node, Type.LIST_ITEM_TEXT);
    },
    createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.PARAGRAPH };
    },
    createListNode(type: ListType = ListType.UNORDERED, props = {}) {
        const nodeType = type === ListType.ORDERED_LIST ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
        return { children: [{ text: '' }], ...props, type: nodeType };
    },
    createListItemNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM };
    },
    createListItemTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM_TEXT };
    },
});