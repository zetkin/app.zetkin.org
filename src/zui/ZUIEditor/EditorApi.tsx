import { FC, MutableRefObject, useEffect } from 'react';
import { useCommands, useEditorState } from '@remirror/react';
import { EditorState } from '@remirror/pm';

export type ZUIEditorApi = {
  /** Clear the editor */
  clear: () => void;
  /** Focus the editor */
  focus: () => void;
  /** Move a block to another position */
  moveBlock: (fromIndex: number, toIndex: number) => void;
  /** Select a block by index */
  setSelectedBlockIndex: (selectedBlockIndex: number) => void;
};

const getBlockPos = (state: EditorState, blockIndex: number): number | null => {
  let pos = null;

  state.doc.forEach((node, offset, index) => {
    if (index === blockIndex) {
      pos = offset;
      return false;
    }
  });

  return pos;
};

export const EditorApi: FC<{
  editorApiRef: MutableRefObject<ZUIEditorApi | null>;
}> = ({ editorApiRef }) => {
  const { focus, moveBlockToIndex, setContent } = useCommands();
  const state = useEditorState();

  useEffect(() => {
    if (!editorApiRef) {
      return;
    }
    editorApiRef.current = {
      clear: () => {
        setContent({
          content: [],
          type: 'doc',
        });
      },
      focus: () => {
        focus();
      },
      moveBlock: (fromRemirrorIndex, toRemirrorIndex) => {
        if (toRemirrorIndex === fromRemirrorIndex) {
          return;
        }

        const pos = getBlockPos(state, fromRemirrorIndex);
        if (pos === null) {
          return;
        }
        focus(pos);

        moveBlockToIndex(fromRemirrorIndex, toRemirrorIndex);
      },
      setSelectedBlockIndex: (remirrorIndex) => {
        const pos = getBlockPos(state, remirrorIndex);
        if (pos === null) {
          return;
        }
        focus(pos);
      },
    };
  }, [editorApiRef, focus, moveBlockToIndex, setContent, state]);

  return null;
};
