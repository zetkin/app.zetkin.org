import { Box, Paper } from '@mui/material';
import { useEditorEvent, useEditorView, usePositioner } from '@remirror/react';
import { FC, useEffect, useState } from 'react';

const BlockToolbar: FC = () => {
  const [typing, setTyping] = useState(false);
  const [curBlockPos, setCurBlockPos] = useState<[number, number]>([0, 0]);
  const [curBlockType, setCurBlockType] = useState<string>();
  const positioner = usePositioner('block');
  const selectionPositioner = usePositioner('selection');
  const view = useEditorView();

  useEffect(() => {
    if (positioner.active) {
      setCurBlockPos([positioner.x, positioner.y]);
      setCurBlockType(positioner.data.node?.type.name);
    }
  }, [positioner.y]);

  useEditorEvent('keyup', () => {
    setTyping(true);
  });

  useEffect(() => {
    if (view.root) {
      const handleMove = () => {
        setTyping(false);
      };

      view.root.addEventListener('mousemove', handleMove);

      return () => view.root.removeEventListener('mousemove', handleMove);
    }
  }, [view.root]);

  const { ref } = positioner;
  const [x, y] = curBlockPos;

  const showBar = (positioner.active || selectionPositioner.active) && !typing;

  return (
    <Box position="relative">
      <Box
        ref={ref}
        sx={{
          left: x,
          opacity: showBar ? 1 : 0,
          pointerEvents: showBar ? 'auto' : 'none',
          position: 'absolute',
          top: y - 32,
          transition: 'opacity 0.5s',
          zIndex: 10000,
        }}
      >
        <Paper elevation={1} sx={{ p: 1 }}>
          {curBlockType}
        </Paper>
      </Box>
    </Box>
  );
};

export default BlockToolbar;
