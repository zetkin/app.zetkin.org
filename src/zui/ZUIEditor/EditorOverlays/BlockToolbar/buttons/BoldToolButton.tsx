import { FormatBold } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const BoldToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleBold } = useCommands();

  return (
    <Button
      color={active.bold() ? 'primary' : 'secondary'}
      onClick={() => {
        toggleBold();
        focus();
      }}
    >
      <FormatBold />
    </Button>
  );
};

export default BoldToolButton;
