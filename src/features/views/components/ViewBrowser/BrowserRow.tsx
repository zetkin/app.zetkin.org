import { useDrop } from 'react-dnd';
import { useRouter } from 'next/router';
import { Box, useTheme } from '@mui/material';
import { createContext, FC } from 'react';
import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';

import useViewBrowserMutation from 'features/views/hooks/useViewBrowserMutation';
import { ViewBrowserItem } from 'features/views/hooks/useItems';

interface BrowserRowProps {
  item: ViewBrowserItem;
  rowProps: GridRowProps;
}

export interface BrowserRowDropProps {
  active: boolean;
}

export const BrowserRowContext = createContext<BrowserRowDropProps>({
  active: false,
});

/**
 * Row component for MUI X DataGrid, to be used in the ViewBrowser.
 * Adds support for dropping views/folders onto the row, highlighting
 * the row when dragging over, etc.
 */
const BrowserRow: FC<BrowserRowProps> = ({ item, rowProps }) => {
  const theme = useTheme();
  const { orgId } = useRouter().query;
  const { moveItem } = useViewBrowserMutation(parseInt(orgId as string));
  const [dropProps, dropRef] = useDrop<
    ViewBrowserItem,
    unknown,
    BrowserRowDropProps
  >({
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
        moveItem(draggedItem.type, draggedItem.data.id, parentId);
      }
    },
  });

  let content = <GridRow {...rowProps} />;

  if (item.type != 'view') {
    // If it's not a view, wrap it in a drop target
    content = (
      <Box
        ref={dropRef}
        style={{
          backgroundColor: dropProps.active
            ? theme.palette.background.paper
            : 'transparent',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <BrowserRowContext.Provider value={dropProps}>
      {content}
    </BrowserRowContext.Provider>
  );
};

export default BrowserRow;
