import { Box, Button, Paper } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

import VariableToolButton from './VariableToolButton';
import { VariableName } from '../extensions/VariableExtension';

type BlockToolbarProps = {
  curBlockType: string;
  curBlockY: number;
  enableVariable: boolean;
  pos: number;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  enableVariable,
  pos,
}) => {
  const { convertParagraph, focus, insertVariable, toggleHeading, pickImage } =
    useCommands();

  return (
    <Box position="relative">
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: curBlockY - 50,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1} sx={{ p: 1 }}>
          {curBlockType}
          {curBlockType == 'zimage' && (
            <Button
              onClick={() => {
                pickImage(pos);
              }}
            >
              Change image
            </Button>
          )}
          {curBlockType == 'heading' && (
            <Button onClick={() => convertParagraph()}>
              Convert to paragraph
            </Button>
          )}
          {curBlockType == 'paragraph' && (
            <Button onClick={() => toggleHeading()}>Convert to heading</Button>
          )}
          {enableVariable &&
            (curBlockType == 'paragraph' || curBlockType == 'heading') && (
              <VariableToolButton
                onSelect={(varName: VariableName) => {
                  insertVariable(varName);
                  focus();
                }}
              />
            )}
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
