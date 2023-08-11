import { BaseEditor, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export interface MarkdownEditorProps {
  onChange: (value: Descendant[]) => void;
  value: Descendant[];
  minHeight?: string;
  customEditor?: BaseEditor & ReactEditor & HistoryEditor;
  hideTabBar?: boolean;
}
