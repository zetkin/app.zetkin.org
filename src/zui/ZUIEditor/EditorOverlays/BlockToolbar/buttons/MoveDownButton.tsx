import { ArrowDownward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands, useEditorState } from '@remirror/react';
import { FC } from 'react';

const MoveDownButton: FC = () => {
  const state = useEditorState();
  const { delete: deleteRange, moveBlock } = useCommands();

  const pos = state.selection.$head.pos;
  const resolved = state.doc.resolve(pos);
  const node = resolved.node(1);

  const posBefore = resolved.before(1);
  const posAfter = resolved.after(1);
  const resolvedBefore = state.doc.resolve(posBefore);
  const resolvedAfter = state.doc.resolve(posAfter);

  const nodeAfter = resolvedAfter.nodeAfter;

  const indexOfCurrentBlock = resolvedBefore.index();
  const indexOfBlockAfter = indexOfCurrentBlock + 1;

  const numberOfBlocks = state.doc.children.length;
  const nextBlockIsLast = indexOfBlockAfter == numberOfBlocks - 1;
  const nextBlockIsEmptyLastBlock =
    nextBlockIsLast && nodeAfter?.content.size == 0;

  return (
    <IconButton
      disabled={!nodeAfter || nextBlockIsEmptyLastBlock}
      onClick={() => {
        if (nodeAfter && !nextBlockIsEmptyLastBlock) {
          const blockAfterPos = resolvedBefore.posAtIndex(
            indexOfCurrentBlock + 2
          );
          moveBlock(node, blockAfterPos);
          deleteRange({ from: posBefore, to: posAfter });
        }
      }}
    >
      <ArrowDownward />
    </IconButton>
  );
};

export default MoveDownButton;
