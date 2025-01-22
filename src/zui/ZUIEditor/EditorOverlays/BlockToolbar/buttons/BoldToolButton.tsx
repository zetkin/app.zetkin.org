import { FormatBold } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const BoldToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleBold } = useCommands();

  return (
    <IconButton
      color={active.bold() ? 'primary' : 'secondary'}
      onClick={() => {
        toggleBold();
        focus();
      }}
    >
      <FormatBold />
    </IconButton>
  );
};

export default BoldToolButton;
