import { FormatStrikethroughSharp } from '@mui/icons-material';
import { Button, lighten } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const StrikethroughToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleStrike } = useCommands();

  const isStrike = active.strike();
  const isVariable = active.zvariable?.() || false;

  return (
    <Button
      disabled={isVariable}
      onClick={() => {
        toggleStrike();
        focus();
      }}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: isStrike
            ? lighten(theme.palette.primary.main, 0.8)
            : '',
        },
        backgroundColor: isStrike
          ? lighten(theme.palette.primary.main, 0.7)
          : '',
      })}
    >
      <FormatStrikethroughSharp />
    </Button>
  );
};

export default StrikethroughToolButton;
