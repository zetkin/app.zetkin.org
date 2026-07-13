import NextLink from 'next/link';
import { FC, MouseEvent, ReactNode, useMemo, useState } from 'react';
import { Link, Theme, useMediaQuery } from '@mui/material';

import BrowserDraggableItem from './BrowserDragableItem';
import BrowserItem from './BrowserItem';
import BrowserItemIcon from './BrowserItemIcon';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import useViewBrowserItems, {
  ViewBrowserItem,
} from 'features/views/hooks/useViewBrowserItems';
import messageIds from 'features/views/l10n/messageIds';
import BrowserList, {
  GridColDef,
  GridSortModel,
  ViewBrowserRow,
} from 'features/views/components/ViewBrowser/BrowserList';
import BrowserEllipsisMenu from 'features/views/components/ViewBrowser/BrowserEllipsisMenu';
import useViewBrowserMutations from 'features/views/hooks/useViewBrowserMutations';
import MoveViewDialog from 'features/views/components/MoveViewDialog';
import BrowserDragLayer from 'features/views/components/ViewBrowser/BrowserDragLayer';

interface ViewBrowserProps {
  basePath: string;
  enableDragAndDrop?: boolean;
  enableEllipsisMenu?: boolean;
  folderId?: number | null;
  header?: ReactNode;
  onSelect?: (item: ViewBrowserItem, ev: MouseEvent) => void;
}

const TYPE_SORT_ORDER = ['loading', 'back', 'folder', 'view'];

function typeComparator(v0: ViewBrowserItem, v1: ViewBrowserItem): number {
  const index0 = TYPE_SORT_ORDER.indexOf(v0.type);
  const index1 = TYPE_SORT_ORDER.indexOf(v1.type);
  return index0 - index1;
}

const ViewBrowser: FC<ViewBrowserProps> = ({
  basePath,
  enableDragAndDrop = true,
  enableEllipsisMenu = true,
  folderId = null,
  onSelect,
  header,
}) => {
  const { orgId } = useNumericRouteParams();

  const messages = useMessages(messageIds);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'title', sort: 'asc' },
  ]);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const itemsFuture = useViewBrowserItems(orgId, folderId);

  const [itemToBeMoved, setItemToBeMoved] = useState<ViewBrowserItem | null>(
    null
  );

  const { renameItem } = useViewBrowserMutations(orgId);

  const [itemToBeRenamed, setItemToBeRenamed] =
    useState<ViewBrowserItem | null>(null);

  const colDefs: GridColDef[] = useMemo(() => {
    const colDefs: GridColDef[] = [
      {
        field: 'icon',
        headerName: '',
        renderCell: (params) => {
          const item = params.row;

          if (item.type === 'loading') {
            return '';
          }

          const subPath = item.folderId ? 'folders/' + item.folderId : '';
          if (item.type == 'back') {
            return (
              <NextLink href={`${basePath}/${subPath}`} legacyBehavior passHref>
                <Link
                  color="inherit"
                  onClick={(ev) => onSelect?.(item, ev)}
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <BrowserItemIcon item={params.row} />
                </Link>
              </NextLink>
            );
          } else {
            return (
              <NextLink href={`${basePath}/${item.id}`} legacyBehavior passHref>
                <Link
                  color="inherit"
                  onClick={(ev) => onSelect?.(item, ev)}
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <BrowserDraggableItem item={params.row}>
                    <BrowserItemIcon item={params.row} />
                  </BrowserDraggableItem>
                </Link>
              </NextLink>
            );
          }
        },
        sortable: false,
        width: 40,
      },
      {
        field: 'title',
        flex: 2,
        headerName: messages.viewsList.columns.title(),
        renderCell: (params) => {
          const item = params.row;
          return (
            <BrowserItem
              basePath={basePath}
              item={params.row}
              onClick={(ev) => {
                onSelect?.(item, ev);
              }}
              onRenamed={(item, title, canceled) => {
                if (
                  !canceled &&
                  (item.type === 'folder' || item.type === 'view')
                ) {
                  renameItem(item.type, item.data.id, title);
                }
                setItemToBeRenamed(null);
              }}
              renaming={params.renaming}
            />
          );
        },
        sortable: true,
      },
    ];

    if (!isMobile) {
      colDefs.push({
        field: 'owner',
        flex: 1,
        headerName: messages.viewsList.columns.owner(),
        renderCell: (params) => {
          if (params.row.type == 'view') {
            const owner = params.row.data.owner;
            return (
              <ZUIPersonHoverCard personId={owner.id}>
                <ZUIPerson id={owner.id} name={owner.name} />
              </ZUIPersonHoverCard>
            );
          } else {
            return '';
          }
        },
        sortable: true,
      });

      if (enableEllipsisMenu) {
        colDefs.push({
          field: 'menu',
          headerName: '',
          renderCell: (params) => {
            const item = params.row;
            if (item.type == 'back' || item.type === 'loading') {
              return null;
            }
            return (
              <BrowserEllipsisMenu
                item={item}
                orgId={orgId}
                setItemToBeMoved={setItemToBeMoved}
                setItemToBeRenamed={setItemToBeRenamed}
              />
            );
          },
          width: 40,
        });
      }
    }

    return colDefs;
  }, [
    basePath,
    enableEllipsisMenu,
    isMobile,
    messages.viewsList.columns,
    onSelect,
    orgId,
    renameItem,
  ]);

  const items = useMemo(() => {
    if (itemsFuture.isLoading) {
      return Array.from<ViewBrowserItem>({ length: 40 }).fill({
        type: 'loading',
      });
    }

    if (!itemsFuture.data) {
      return [];
    }

    return itemsFuture.data.sort((item0, item1) => {
      const typeSort = typeComparator(item0, item1);
      if (typeSort != 0) {
        return typeSort;
      }

      if (
        (item0.type === 'view' || item0.type === 'folder') &&
        (item1.type === 'view' || item1.type === 'folder')
      ) {
        for (const column of sortModel) {
          let sort = 0;
          if (column.field == 'title') {
            sort = item0.title.localeCompare(item1.title);
          } else if (column.field == 'owner') {
            sort = item0.owner.localeCompare(item1.owner);
          }

          if (sort != 0) {
            return column.sort == 'asc' ? sort : -sort;
          }
        }
      }

      return 0;
    });
  }, [itemsFuture.data, itemsFuture.isLoading, sortModel]);

  const rows: ViewBrowserRow[] = useMemo(
    () =>
      items.map((item) => ({
        item: item,
        renaming:
          item.type !== 'loading' &&
          !!itemToBeRenamed &&
          itemToBeRenamed.type !== 'loading' &&
          item.id === itemToBeRenamed.id,
      })),
    [itemToBeRenamed, items]
  );

  return (
    <>
      {enableDragAndDrop && <BrowserDragLayer />}

      <BrowserList
        cols={colDefs}
        enableDragAndDrop={enableDragAndDrop}
        header={header}
        rows={rows}
        setSortModel={setSortModel}
        sortModel={sortModel}
      />

      {itemToBeMoved && (
        <MoveViewDialog
          close={() => setItemToBeMoved(null)}
          itemToMove={itemToBeMoved}
        />
      )}
    </>
  );
};

export default ViewBrowser;
