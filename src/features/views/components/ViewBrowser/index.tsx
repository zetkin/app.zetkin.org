import NextLink from 'next/link';
import {
  DataGridPro,
  GridColDef,
  GridRowProps,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { FC, useContext, useEffect, useState } from 'react';
import { Link, Theme, useMediaQuery } from '@mui/material';

import BrowserDraggableItem from './BrowserDragableItem';
import BrowserDragLayer from './BrowserDragLayer';
import BrowserItem from './BrowserItem';
import BrowserItemIcon from './BrowserItemIcon';
import BrowserRow from './BrowserRow';
import useFolder from 'features/views/hooks/useFolder';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from 'features/views/hooks/useViewBrowserMutations';
import useViewMutations from 'features/views/hooks/useViewMutations';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import useViewBrowserItems, {
  ViewBrowserItem,
} from 'features/views/hooks/useViewBrowserItems';

import messageIds from 'features/views/l10n/messageIds';
import dynamic from 'next/dynamic';
const EasyEmail = dynamic(import('features/testEmail/easyEmail'), {
  ssr: false,
});

interface ViewBrowserProps {
  basePath: string;
  folderId?: number | null;
}

const TYPE_SORT_ORDER = ['back', 'folder', 'view'];

function typeComparator(v0: ViewBrowserItem, v1: ViewBrowserItem): number {
  const index0 = TYPE_SORT_ORDER.indexOf(v0.type);
  const index1 = TYPE_SORT_ORDER.indexOf(v1.type);
  return index0 - index1;
}

const ViewBrowser: FC<ViewBrowserProps> = ({ basePath, folderId = null }) => {
  const { orgId } = useNumericRouteParams();

  const messages = useMessages(messageIds);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'title', sort: 'asc' },
  ]);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const gridApiRef = useGridApiRef();

  const { deleteView } = useViewMutations(orgId);
  const { renameItem } = useViewBrowserMutations(orgId);
  const itemsFuture = useViewBrowserItems(orgId, folderId);
  const { deleteFolder, recentlyCreatedFolder } = useFolder(orgId);

  // If a folder was created, go into rename state
  useEffect(() => {
    if (gridApiRef.current && recentlyCreatedFolder) {
      gridApiRef.current.startCellEditMode({
        field: 'title',
        id: 'folders/' + recentlyCreatedFolder.id,
      });
    }
  }, [recentlyCreatedFolder]);

  const colDefs: GridColDef<ViewBrowserItem>[] = [
    {
      disableColumnMenu: true,
      field: 'icon',
      filterable: false,
      headerName: '',
      renderCell: (params) => {
        const item = params.row;
        const subPath = item.folderId ? 'folders/' + item.folderId : '';
        if (item.type == 'back') {
          return (
            <NextLink href={`${basePath}/${subPath}`} passHref>
              <Link color="inherit">
                <BrowserItemIcon item={params.row} />
              </Link>
            </NextLink>
          );
        } else {
          return (
            <NextLink href={`${basePath}/${item.id}`} passHref>
              <Link color="inherit">
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
      disableColumnMenu: true,
      editable: true,
      field: 'title',
      flex: 2,
      headerName: messages.viewsList.columns.title(),
      renderCell: (params) => {
        return <BrowserItem basePath={basePath} item={params.row} />;
      },
    },
  ];

  if (!isMobile) {
    colDefs.push({
      disableColumnMenu: true,
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
    });

    colDefs.push({
      field: 'menu',
      headerName: '',
      renderCell: (params) => {
        const item = params.row;
        if (item.type == 'back') {
          return null;
        }
        return (
          <ZUIEllipsisMenu
            items={[
              {
                label: messages.browser.menu.rename(),
                onSelect: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  gridApiRef.current.startCellEditMode({
                    field: 'title',
                    id: params.row.id,
                  });
                },
              },
              {
                id: 'delete-item',
                label: messages.browser.menu.delete(),
                onSelect: (e) => {
                  e.stopPropagation();
                  showConfirmDialog({
                    onSubmit: () => {
                      if (item.type == 'folder') {
                        deleteFolder(item.data.id);
                      } else if (params.row.type == 'view') {
                        deleteView(item.data.id);
                      }
                    },
                    title: messages.browser.confirmDelete[item.type].title(),
                    warningText:
                      messages.browser.confirmDelete[item.type].warning(),
                  });
                },
              },
            ]}
          />
        );
      },
      width: 40,
    });
  }

  return (
    <>
      <ZUIFuture future={itemsFuture}>
        {(data) => {
          const rows = data.sort((item0, item1) => {
            const typeSort = typeComparator(item0, item1);
            if (typeSort != 0) {
              return typeSort;
            }

            // If we get this far, none of the items will be of the "back"
            // type, because there is only one 'back' and typeComparator()
            // always returns non-zero when the two items are of different
            // type. We still check for "back" here, because TypeScript
            // doesn't understand the logic described above.
            if (item0.type != 'back' && item1.type != 'back') {
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

          return (
            <>
              <EasyEmail />
              <BrowserDragLayer />
              {/*<DataGridPro
                apiRef={gridApiRef}
                autoHeight
                columns={colDefs}
                disableRowSelectionOnClick
                hideFooter
                isCellEditable={(params) => params.row.type != 'back'}
                onSortModelChange={(model) => setSortModel(model)}
                processRowUpdate={(item) => {
                  if (item.type != 'back') {
                    renameItem(item.type, item.data.id, item.title);
                  }
                  return item;
                }}
                rows={rows}
                slots={{
                  row: (props: GridRowProps) => {
                    const item = props.row as ViewBrowserItem;
                    return <BrowserRow item={item} rowProps={props} />;
                  },
                }}
                sortingMode="server"
                sx={{ borderWidth: 0 }}
              />*/}
            </>
          );
        }}
      </ZUIFuture>
    </>
  );
};

export default ViewBrowser;
