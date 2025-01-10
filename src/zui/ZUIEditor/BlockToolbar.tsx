import { Box, Paper } from '@mui/material';
import { usePositioner } from '@remirror/react';
import { FC } from 'react';

const BlockToolbar: FC = () => {
  const positioner = usePositioner('block');

  if (positioner.active) {
    const { data, ref, x, y } = positioner;

    return (
      <Box position="relative">
        <Box
          ref={ref}
          sx={{ left: x, position: 'absolute', top: y - 32, zIndex: 10000 }}
        >
          <Paper elevation={1} sx={{ p: 1 }}>
            {data.node.type.name}
          </Paper>
        </Box>
      </Box>
    );
  }
  return null;
};

export default BlockToolbar;
