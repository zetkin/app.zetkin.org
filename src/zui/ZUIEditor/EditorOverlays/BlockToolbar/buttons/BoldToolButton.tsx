import { FormatBold } from '@mui/icons-material';
import { Button, lighten } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const BoldToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleBold } = useCommands();

  const isBold = active.bold();
  const isVariable = active.zvariable();

  return (
    <Button
      disabled={isVariable}
      onClick={() => {
        toggleBold();
        focus();
      }}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: isBold
            ? lighten(theme.palette.primary.main, 0.8)
            : '',
        },
        backgroundColor: isBold ? lighten(theme.palette.primary.main, 0.7) : '',
      })}
    >
      <FormatBold />
    </Button>
  );
};

export default BoldToolButton;
