import { KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands, useRemirrorContext } from '@remirror/react';
import { NodeSelection } from 'prosemirror-state';
import { FC } from 'react';

import {
  recordSelectionState,
  recoverSelection,
} from 'zui/ZUIEditor/utils/recoverSelection';

const MoveUpButton: FC = () => {
  const { moveBlockUp } = useCommands();
  const { view } = useRemirrorContext();

  return (
    <IconButton
      disabled={!moveBlockUp.enabled()}
      onClick={() => {
        if (!moveBlockUp.enabled()) {
          return;
        }

        const selState = recordSelectionState(view);
        moveBlockUp();
        recoverSelection(selState);
      }}
      size="small"
    >
      <KeyboardArrowUp fontSize="inherit" />
    </IconButton>
  );
};

export default MoveUpButton;
