import { FormatIndentDecrease } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

const DedentButton: FC = () => {
  const { focus, dedent } = useCommands();

  return (
    <Button
      onClick={() => {
        dedent();
        focus();
      }}
    >
      <FormatIndentDecrease />
    </Button>
  );
};

export default DedentButton;
