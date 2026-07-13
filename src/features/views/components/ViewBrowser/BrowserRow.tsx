import { useDrop } from 'react-dnd';
import { Box, useTheme } from '@mui/material';
import { createContext, FC, PropsWithChildren } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from 'features/views/hooks/useViewBrowserMutations';
import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';

type BrowserRowProps = {
  enableDragAndDrop?: boolean;
  item: ViewBrowserItem;
} & PropsWithChildren;

export interface BrowserRowDropProps {
  active: boolean;
}

export const BrowserRowContext = createContext<BrowserRowDropProps>({
  active: false,
});

/**
 * Row component to be used in the ViewBrowser.
 * Adds support for dropping views/folders onto the row, highlighting
 * the row when dragging over, etc.
 */
const BrowserRow: FC<BrowserRowProps> = ({
  item,
  children,
  enableDragAndDrop,
}) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const { moveItem } = useViewBrowserMutations(orgId);
  const [dropProps, dropRef] = useDrop<
    ViewBrowserItem,
    unknown,
    BrowserRowDropProps
  >({
    accept: 'ITEM',
    canDrop: (draggedItem) => {
      if (draggedItem.type === 'loading' || item.type === 'loading') {
        return false;
      }
      return draggedItem.type == 'view' || draggedItem.id != item.id;
    },
    collect: (monitor) => {
      return {
        active: monitor.isOver() && monitor.canDrop(),
      };
    },
    drop: (draggedItem) => {
      if (item.type === 'loading') {
        return;
      }

      if (draggedItem.type == 'folder' || draggedItem.type == 'view') {
        const parentId = item.type == 'back' ? item.folderId : item.data.id;
        moveItem(draggedItem.type, draggedItem.data.id, parentId);
      }
    },
  });

  if (!enableDragAndDrop) {
    return children;
  }

  let content = children;

  if (item.type != 'view') {
    // If it's not a view, wrap it in a drop target
    content = (
      <Box
        ref={(node: HTMLDivElement | null) => {
          dropRef(node);
        }}
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
