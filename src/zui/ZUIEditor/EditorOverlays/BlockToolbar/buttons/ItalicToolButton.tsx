import { FormatItalic } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const ItalicToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleItalic } = useCommands();

  return (
    <Button
      color={active.italic() ? 'primary' : 'secondary'}
      onClick={() => {
        toggleItalic();
        focus();
      }}
    >
      <FormatItalic />
    </Button>
  );
};

export default ItalicToolButton;
