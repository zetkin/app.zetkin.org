import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const MoveDownButton: FC = () => {
  const { moveBlockDown } = useCommands();

  return (
    <IconButton
      disabled={!moveBlockDown.enabled()}
      onClick={() => {
        if (!moveBlockDown.enabled()) {
          return;
        }

        moveBlockDown();
      }}
      size="small"
    >
      <KeyboardArrowDown fontSize="inherit" />
    </IconButton>
  );
};

export default MoveDownButton;
