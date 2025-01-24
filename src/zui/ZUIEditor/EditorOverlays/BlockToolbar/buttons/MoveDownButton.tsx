import { ArrowDownward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const MoveDownButton: FC = () => {
  const { focus, moveBlockDown } = useCommands();

  return (
    <IconButton
      disabled={!moveBlockDown.enabled()}
      onClick={() => {
        if (moveBlockDown.enabled()) {
          moveBlockDown();
          focus();
        }
      }}
    >
      <ArrowDownward />
    </IconButton>
  );
};

export default MoveDownButton;
