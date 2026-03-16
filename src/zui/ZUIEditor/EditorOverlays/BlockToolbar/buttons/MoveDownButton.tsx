import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands, useRemirrorContext } from '@remirror/react';
import { FC } from 'react';

import {
  recordSelectionState,
  recoverSelection,
} from 'zui/ZUIEditor/utils/recoverSelection';

const MoveDownButton: FC = () => {
  const { moveBlockDown } = useCommands();
  const { view } = useRemirrorContext();

  return (
    <IconButton
      disabled={!moveBlockDown.enabled()}
      onClick={() => {
        if (!moveBlockDown.enabled()) {
          return;
        }

        const selState = recordSelectionState(view);
        moveBlockDown();
        recoverSelection(selState);
      }}
      size="small"
    >
      <KeyboardArrowDown fontSize="inherit" />
    </IconButton>
  );
};

export default MoveDownButton;
