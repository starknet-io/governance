import {
  Editor,
  Transforms,
  Element as SlateElement,
  BaseElement,
  Path,
} from "slate";
import { CustomParagraphTypes } from "./ElementLeaf";
import { ReactEditor } from "slate-react";
import { ListType, ListsEditor } from "@prezly/slate-lists";

export const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES: CustomParagraphTypes[] = ["ul_list", "ol_list"];

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as { [key: string]: any };
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        return (
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          //@ts-expect-error error
          n.type === format
        );
      },
    }),
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, format: CustomParagraphTypes) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  const isImage = format === "image";

  if(isList && isActive){
      ListsEditor.unwrapList(editor)
  } 
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      //@ts-expect-error error
      LIST_TYPES.includes(n.type),
    split: true,
  });

  const type: CustomParagraphTypes = isActive
    ? "paragraph"
    : isList
    ? "list_item"
    : format;
  const newProperties: Partial<BaseElement & { type: CustomParagraphTypes }> = {
    type,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    ListsEditor.wrapInList(editor, format === 'ol_list' ? ListType.ORDERED : ListType.UNORDERED)
    // const block = { type: format, children: [] };
    // Transforms.wrapNodes(editor, block);
  } else if (!isActive && isImage) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const withInlines = (editor: ReactEditor) => {
  const { isInline } = editor;
  editor.isInline = (element: any) =>
    ['link'].includes(element.type) || isInline(element);
  return editor
}
