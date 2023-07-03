import { Descendant } from "slate";

export interface MarkdownEditorProps {
  onChange: (value: Descendant[]) => void;
  value: Descendant[];
  minHeight?: string;
}
