import { Descendant } from "slate";

export interface ParagraphElement {
  type: "paragraph";
  children: Descendant[];
}

export const defaultInitialValue: ParagraphElement[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
