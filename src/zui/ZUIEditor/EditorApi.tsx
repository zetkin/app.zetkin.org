import { FC, MutableRefObject, useEffect } from 'react';
import { useCommands, useEditorState } from '@remirror/react';
import { EditorState } from '@remirror/pm';

export type ZUIEditorApi = {
  clear: () => void;
  moveBlock: (fromZetkinIndex: number, toZetkinIndex: number) => void;
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
  const { focus, moveBlockDown, moveBlockUp, setContent } = useCommands();
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
      moveBlock: (fromRemirrorIndex, toRemirrorIndex) => {
        const diff = toRemirrorIndex - fromRemirrorIndex;

        if (diff === 0) {
          return;
        }

        const pos = getBlockPos(state, fromRemirrorIndex);
        if (pos === null) {
          return;
        }
        focus(pos);

        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            moveBlockDown();
          }
        } else {
          for (let i = 0; i < Math.abs(diff); i++) {
            moveBlockUp();
          }
        }
      },
      setSelectedBlockIndex: (remirrorIndex) => {
        const pos = getBlockPos(state, remirrorIndex);
        if (pos === null) {
          return;
        }
        focus(pos);
      },
    };
  }, [editorApiRef, focus, moveBlockDown, moveBlockUp, setContent, state]);

  return null;
};
