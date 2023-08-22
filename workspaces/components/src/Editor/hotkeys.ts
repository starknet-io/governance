import {
  Editor,
  Transforms,
  Element as SlateElement,
  BaseElement,
} from "slate";
import { CustomParagraphTypes } from "./ElementLeaf";

export const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES: CustomParagraphTypes[] = ["bulleted_list", "numbered_list"];

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
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  } else if (!isActive && isImage) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
