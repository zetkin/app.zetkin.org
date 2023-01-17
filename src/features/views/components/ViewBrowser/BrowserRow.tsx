import { Box } from '@mui/material';
import { FC } from 'react';
import { useDrop } from 'react-dnd';
import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';

import ViewBrowserModel, {
  ViewBrowserItem,
} from 'features/views/models/ViewBrowserModel';

interface BrowserRowProps {
  item: ViewBrowserItem;
  model: ViewBrowserModel;
  rowProps: GridRowProps;
}

interface CollectedProps {
  active: boolean;
}

/**
 * Row component for MUI X DataGrid, to be used in the ViewBrowser.
 * Adds support for dropping views/folders onto the row, highlighting
 * the row when dragging over, etc.
 */
const BrowserRow: FC<BrowserRowProps> = ({ item, model, rowProps }) => {
  const [, dropRef] = useDrop<ViewBrowserItem, unknown, CollectedProps>({
    accept: 'ITEM',
    canDrop: (draggedItem) =>
      draggedItem.type == 'view' || draggedItem.id != item.id,
    collect: (monitor) => {
      return {
        active: monitor.isOver() && monitor.canDrop(),
      };
    },
    drop: (draggedItem) => {
      if (draggedItem.type == 'folder' || draggedItem.type == 'view') {
        const parentId = item.type == 'back' ? item.folderId : item.data.id;
        model.moveItem(draggedItem.type, draggedItem.data.id, parentId);
      }
    },
  });

  if (item.type == 'view') {
    // No drop target for views
    return <GridRow {...rowProps} />;
  }

  return (
    <Box ref={dropRef}>
      <GridRow {...rowProps} />
    </Box>
  );
};

export default BrowserRow;
