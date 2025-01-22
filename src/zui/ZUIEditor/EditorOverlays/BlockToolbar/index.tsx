import { Box, Button, Paper } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

import VariableToolButton from './buttons/VariableToolButton';
import { VariableName } from './../../extensions/VariableExtension';
import BoldToolButton from './buttons/BoldToolButton';
import ItalicToolButton from './buttons/ItalicToolButton';
import LinkToolButton from './buttons/LinkToolButton';

type BlockToolbarProps = {
  curBlockType: string;
  curBlockY: number;
  enableBold: boolean;
  enableHeading: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  pos: number;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  enableBold,
  enableHeading,
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
                {enableHeading && (
                  <Button onClick={() => toggleHeading()}>
                    Convert to heading
                  </Button>
                )}
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
