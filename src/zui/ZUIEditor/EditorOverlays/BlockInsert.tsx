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

const BlockInsert: FC<BlockInsertProps> = ({ blockDividers, mouseY }) => {
  const { insertEmptyParagraph, focus } = useCommands();

  return (
    <Box position="relative">
      {blockDividers.map(({ pos, y }, index) => {
        const visible = Math.abs(mouseY - y) < 20;
        const offset = 8;

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
            }}
          >
            <Box
              sx={{
                pointerEvents: visible ? 'auto' : 'none',
                position: 'relative',
                top: -16,
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
