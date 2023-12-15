import { ReactEditor, withReact } from "slate-react";
import { withHistory } from 'slate-history';
import { withInlines } from "./withInlines";
import { createEditor } from "slate";
import { withDeleteEmptyBlock } from "./withDeleteEmptyBlock";

const plugins = [
  withInlines,
  withDeleteEmptyBlock,
    withHistory,
  ];
  
export const createEditorWithPlugins = (): ReactEditor => plugins.reduce((result, plugin) => plugin(result), withReact(createEditor()));