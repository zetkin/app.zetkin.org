import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Paper } from '@mui/material';
import { useDragLayer, XYCoord } from 'react-dnd';

import BrowserItemIcon from './BrowserItemIcon';
import { ViewBrowserItem } from 'features/views/models/ViewBrowserModel';

const useStyles = makeStyles({
  dragLayer: {
    left: 0,
    pointerEvens: 'none',
    position: 'fixed',
    top: 0,
    zIndex: 9999,
  },
  dragPreview: {
    backgroundColor: 'white',
    padding: 10,
    pointerEvents: 'none',
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
});

interface CollectedProps {
  currentOffset: XYCoord | null;
  isDragging: boolean;
  item: ViewBrowserItem;
}

const BrowserDragLayer: FC = () => {
  const styles = useStyles();

  const dragProps = useDragLayer<CollectedProps, ViewBrowserItem>(
    (monitor) => ({
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
    })
  );

  const { isDragging, item, currentOffset } = dragProps;

  if (isDragging && currentOffset) {
    return (
      <Box className={styles.dragLayer}>
        <Paper
          className={styles.dragPreview}
          elevation={5}
          style={{
            left: currentOffset.x,
            top: currentOffset.y,
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
