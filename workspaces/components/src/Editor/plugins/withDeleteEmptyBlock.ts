import {Range} from 'slate';
import { toggleBlock } from '../hotkeys';
import { ReactEditor } from 'slate-react';

export const withDeleteEmptyBlock = (editor: ReactEditor) => {
  const {deleteBackward} = editor;

  editor.deleteBackward = (unit) => {
    const {selection} = editor;

    if (selection && selection.focus.offset === 0 && selection.anchor.offset === 0 && Range.isCollapsed(selection)) {
      const node = editor.children[selection.anchor.path[0]] as any | undefined;
      if (['ol_list', 'ul_list'].includes(node?.type) && node.children.length === 1) {
        toggleBlock(editor, node.type);
      }
      deleteBackward(unit);
    } else {
      deleteBackward(unit);
    }
  };

  return editor;
};