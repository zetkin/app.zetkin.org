import { ArrowUpward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands, useEditorState } from '@remirror/react';
import { FC } from 'react';

const MoveUpButton: FC = () => {
  const state = useEditorState();
  const { delete: deleteRange, moveBlock } = useCommands();

  const pos = state.selection.$head.pos;
  const resolved = state.doc.resolve(pos);
  const node = resolved.node(1);

  const posBefore = resolved.before(1);
  const posAfter = resolved.after(1);
  const resolvedBefore = state.doc.resolve(posBefore);

  const nodeBefore = resolvedBefore.nodeBefore;

  return (
    <IconButton
      disabled={!nodeBefore}
      onClick={() => {
        if (nodeBefore) {
          const indexOfCurrentBlock = resolvedBefore.index();
          const blockBeforePos = resolvedBefore.posAtIndex(
            indexOfCurrentBlock - 1
          );

          deleteRange({ from: posBefore, to: posAfter });
          moveBlock(node, blockBeforePos);
        }
      }}
    >
      <ArrowUpward />
    </IconButton>
  );
};

export default MoveUpButton;
