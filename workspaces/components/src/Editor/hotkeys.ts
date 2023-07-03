import { Editor, Transforms, Element as SlateElement, Node } from "slate";

export const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

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

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: Node) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-expect-error asdfasdfsadfsadf
      LIST_TYPES.includes(n.type as string),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {};

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: string,
  // @ts-expect-error asdfasdfsadfsadf
  blockType: keyof SlateElement = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: Node) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    })
  );

  return !!match;
};
