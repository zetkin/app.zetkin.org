import { FormatIndentIncrease } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const IndentButton: FC = () => {
  const { focus, indent } = useCommands();

  return (
    <Button
      onClick={() => {
        indent();
        focus();
      }}
    >
      <FormatIndentIncrease />
    </Button>
  );
};

export default IndentButton;
