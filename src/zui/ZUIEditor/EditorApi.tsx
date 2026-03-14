import { FC, MutableRefObject, useEffect } from 'react';
import { useCommands, useEditorState } from '@remirror/react';
import { EditorState } from '@remirror/pm';

import { remirrorToZetkinWithIndexRemap } from 'zui/ZUIEditor/utils/remirrorToZetkin';

export type ZUIEditorApi = {
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
  const { focus } = useCommands();
  const state = useEditorState();

  useEffect(() => {
    if (!editorApiRef) {
      return;
    }
    editorApiRef.current = {
      setSelectedBlockIndex: (zetkinBlockIndex) => {
        const [, remapped] = remirrorToZetkinWithIndexRemap(
          state.doc.content.toJSON()
        );
        const reversedRemap = Object.fromEntries(
          Object.entries(remapped).map(([k, v]) => [v, Number(k)])
        );
        const remirrorIndex = reversedRemap[zetkinBlockIndex];
        const pos = getBlockPos(state, remirrorIndex);
        if (pos === null) {
          return;
        }
        focus(pos);
      },
    };
  }, [editorApiRef, focus, state]);

  return null;
};
