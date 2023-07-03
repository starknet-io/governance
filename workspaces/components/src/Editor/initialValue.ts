import { Descendant } from "slate";

interface ParagraphElement {
  type: "paragraph";
  children: Descendant[];
}

export const initialValue: ParagraphElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Type your message" }],
  },
];
