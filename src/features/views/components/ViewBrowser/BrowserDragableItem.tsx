import { Box } from '@mui/material';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { FC, ReactNode, useEffect } from 'react';

import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';

interface BrowserDragItemProps {
  children: ReactNode;
  item: ViewBrowserItem;
}

const BrowserDraggableItem: FC<BrowserDragItemProps> = ({ children, item }) => {
  const [, dragRef, preview] = useDrag({
    item: item,
    type: 'ITEM',
  });

  useEffect(() => {
    // Use an empty image as drag/drop preview, to hide while dragging.
    // A nicer preview is rendered by the BrowserDragLayer component.
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <Box ref={dragRef} display="flex" gap={1}>
      {children}
    </Box>
  );
};

export default BrowserDraggableItem;
