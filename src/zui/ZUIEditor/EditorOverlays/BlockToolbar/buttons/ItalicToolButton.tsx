import { FormatItalic } from '@mui/icons-material';
import { Button, lighten } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const ItalicToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleItalic } = useCommands();

  const isItalic = active.italic();
  const isVariable = active.zvariable();

  return (
    <Button
      disabled={isVariable}
      onClick={() => {
        toggleItalic();
        focus();
      }}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: isItalic
            ? lighten(theme.palette.primary.main, 0.8)
            : '',
        },
        backgroundColor: isItalic
          ? lighten(theme.palette.primary.main, 0.7)
          : '',
      })}
    >
      <FormatItalic />
    </Button>
  );
};

export default ItalicToolButton;
