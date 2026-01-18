import { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { useDragDropManager, useDragLayer, XYCoord } from 'react-dnd';

import BrowserItemIcon from './BrowserItemIcon';
import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';
import oldTheme from 'theme';

interface CollectedProps {
  canDrop: boolean;
  currentOffset: XYCoord | null;
  isDragging: boolean;
  item: ViewBrowserItem;
}

const BrowserDragLayer: FC = () => {
  const mgr = useDragDropManager();
  const dragProps = useDragLayer<CollectedProps, ViewBrowserItem>((monitor) => {
    // This is a bit of a hack, because react-dnd does not have a canDrop()
    // method on the monitor passed to useDragLayer(). Instead, we go into
    // the internals of react-dnd and check that there are target IDs under
    // the cursor, and that we can drop onto any of them.
    const mgrMonitor = mgr.getMonitor();
    const targetIds = mgrMonitor.getTargetIds();
    const canDrop = targetIds.some((id) => mgrMonitor.canDropOnTarget(id));

    return {
      canDrop: canDrop,
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
    };
  });

  const { isDragging, item, currentOffset } = dragProps;

  if (isDragging && currentOffset) {
    return (
      <Box
        sx={{
          left: 0,
          pointerEvens: 'none',
          position: 'fixed',
          top: 0,
          zIndex: 9999,
        }}
      >
        <Paper
          sx={{
            '@keyframes dragPreview-in': {
              '0%': {
                transform: 'scale(0.3) rotate(0)',
              },
              '100%': {
                transform: 'scale(1.1) rotate(5deg)',
              },
            },
            animation: `dragPreview-in 400ms ${oldTheme.transitions.easing.easeInOut}`,
            backgroundColor: 'white',
            boxShadow: dragProps.canDrop
              ? '0 6px 6px rgba(0,0,0,0.2)'
              : '0 14px 14px rgba(0,0,0,0.2)',
            left: currentOffset.x,
            padding: 10,
            pointerEvents: 'none',
            position: 'absolute',
            top: currentOffset.y,
            transform: dragProps.canDrop
              ? 'scale(1) rotate(0)'
              : 'scale(1.1) rotate(5deg)',
            transition: 'transform 200ms, box-shadow 200ms',
            whiteSpace: 'nowrap',
          }}
        >
          <Box display="flex" gap={2}>
            <BrowserItemIcon item={item} />
            {item.title}
          </Box>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default BrowserDragLayer;
