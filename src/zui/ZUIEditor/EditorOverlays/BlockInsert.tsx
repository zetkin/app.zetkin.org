import { Add } from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useCommands } from '@remirror/react';
import { FC } from 'react';

import { BlockDividerData } from './index';

type BlockInsertProps = {
  blockDividers: BlockDividerData[];
  mouseY: number;
};

const size = 40;
const topOffset = 16;
const visibilityPadding = 8;

const BlockInsert: FC<BlockInsertProps> = ({ blockDividers, mouseY }) => {
  const { insertEmptyParagraph, focus } = useCommands();

  return (
    <Box position="relative">
      {blockDividers.map(({ pos, y }, index) => {
        const offset = 8;
        const visible =
          mouseY <= y + offset + size - topOffset + visibilityPadding &&
          mouseY >= y + offset - topOffset - visibilityPadding;

        return (
          <Box
            key={index}
            sx={{
              bgcolor: 'red',
              display: 'flex',
              height: '1px',
              justifyContent: 'center',
              opacity: visible ? 1 : 0,
              position: 'absolute',
              top: Math.round(y + offset),
              transition: 'opacity 0.5s',
              width: '100%',
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                height: `${size}px`,
                pointerEvents: visible ? 'auto' : 'none',
                position: 'relative',
                top: -topOffset,
                width: `${size}px`,
              }}
            >
              <Paper>
                <IconButton
                  onClick={() => {
                    insertEmptyParagraph(pos);
                    focus(pos);
                  }}
                >
                  <Add />
                </IconButton>
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default BlockInsert;
