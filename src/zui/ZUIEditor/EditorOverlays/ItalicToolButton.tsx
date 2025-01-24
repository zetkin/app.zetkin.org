import { FormatItalic } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { FC } from 'react';

const ItalicToolButton: FC = () => {
  const active = useActive();
  const { focus, toggleItalic } = useCommands();

  return (
    <IconButton
      color={active.italic() ? 'primary' : 'secondary'}
      onClick={() => {
        toggleItalic();
        focus();
      }}
    >
      <FormatItalic />
    </IconButton>
  );
};

export default ItalicToolButton;
