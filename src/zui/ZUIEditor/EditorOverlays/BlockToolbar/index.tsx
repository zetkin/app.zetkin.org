import { Box, Button, IconButton, Paper } from '@mui/material';
import { useCommands } from '@remirror/react';
import { FC } from 'react';
import { Delete } from '@mui/icons-material';
import { FromToProps } from 'remirror';

import VariableToolButton from './buttons/VariableToolButton';
import { VariableName } from './../../extensions/VariableExtension';
import BoldToolButton from './buttons/BoldToolButton';
import ItalicToolButton from './buttons/ItalicToolButton';
import LinkToolButton from './buttons/LinkToolButton';
import MoveUpButton from './buttons/MoveUpButton';

type BlockToolbarProps = {
  anchorPos: number;
  curBlockType: string;
  curBlockY: number;
  enableBold: boolean;
  enableHeading: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  range: FromToProps;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  curBlockType,
  curBlockY,
  enableBold,
  enableHeading,
  enableItalic,
  enableLink,
  enableVariable,
  anchorPos,
  range,
}) => {
  const {
    convertParagraph,
    delete: deleteRange,
    focus,
    insertVariable,
    toggleHeading,
    pickImage,
  } = useCommands();

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
            <MoveUpButton />
            {curBlockType}
            {curBlockType == 'zimage' && (
              <Button
                onClick={() => {
                  pickImage(anchorPos);
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
            <IconButton onClick={() => deleteRange(range)}>
              <Delete />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
