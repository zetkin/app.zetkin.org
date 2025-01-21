import { Box, Button, Paper } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

import VariableToolButton from './VariableToolButton';
import { VariableName } from '../extensions/VariableExtension';
import BoldToolButton from './BoldToolButton';
import ItalicToolButton from './ItalicToolButton';
import LinkToolButton from './LinkToolButton';

type BlockToolbarProps = {
  curBlockType: string;
  curBlockY: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  pos: number;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  enableBold,
  enableItalic,
  enableLink,
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
        <Paper elevation={1}>
          <Box alignItems="center" display="flex" padding={1}>
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
              <>
                <Button onClick={() => toggleHeading()}>
                  Convert to heading
                </Button>
                {enableLink && <LinkToolButton />}
                {enableBold && <BoldToolButton />}
                {enableItalic && <ItalicToolButton />}
              </>
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
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
