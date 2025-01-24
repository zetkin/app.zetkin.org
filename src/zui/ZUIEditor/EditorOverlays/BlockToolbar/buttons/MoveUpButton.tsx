import { ArrowUpward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const MoveUpButton: FC = () => {
  const { focus, moveBlockUp } = useCommands();

  return (
    <IconButton
      disabled={!moveBlockUp.enabled()}
      onClick={() => {
        if (moveBlockUp.enabled()) {
          moveBlockUp();
          focus();
        }
      }}
    >
      <ArrowUpward />
    </IconButton>
  );
};

export default MoveUpButton;
