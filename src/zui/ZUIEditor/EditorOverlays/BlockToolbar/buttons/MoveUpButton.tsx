import { KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const MoveUpButton: FC = () => {
  const { moveBlockUp } = useCommands();

  return (
    <IconButton
      disabled={!moveBlockUp.enabled()}
      onClick={() => {
        if (!moveBlockUp.enabled()) {
          return;
        }

        moveBlockUp();
      }}
      size="small"
    >
      <KeyboardArrowUp fontSize="inherit" />
    </IconButton>
  );
};

export default MoveUpButton;
