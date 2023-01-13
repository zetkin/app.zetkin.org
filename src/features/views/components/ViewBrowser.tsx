import { Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import {
  ArrowBack,
  Folder,
  InsertDriveFileOutlined,
} from '@mui/icons-material';
import { DataGridPro, GridColDef, GridSortModel } from '@mui/x-data-grid-pro';
import { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ZUIFuture from 'zui/ZUIFuture';
import ViewBrowserModel, { ViewBrowserItem } from '../models/ViewBrowserModel';

interface ViewBrowserProps {
  basePath: string;
  folderId?: number | null;
  model: ViewBrowserModel;
}

const TYPE_SORT_ORDER = ['back', 'folder', 'view'];

function typeComparator(v0: ViewBrowserItem, v1: ViewBrowserItem): number {
  const index0 = TYPE_SORT_ORDER.indexOf(v0.type);
  const index1 = TYPE_SORT_ORDER.indexOf(v1.type);
  return index0 - index1;
}

const useStyles = makeStyles(() => ({
  itemLink: {
    '&:hover': {
      fontWeight: 'bold',
    },
    color: 'inherit',
    textDecoration: 'none',
  },
}));

const ViewBrowser: FC<ViewBrowserProps> = ({
  basePath,
  folderId = null,
  model,
}) => {
  const intl = useIntl();
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const styles = useStyles();

  const colDefs: GridColDef<ViewBrowserItem>[] = [
    {
      disableColumnMenu: true,
      field: 'icon',
      filterable: false,
      headerName: '',
      renderCell: (params) => {
        if (params.row.type == 'folder') {
          return <Folder />;
        } else if (params.row.type == 'back') {
          return <ArrowBack />;
        } else if (params.row.type == 'view') {
          return <InsertDriveFileOutlined />;
        }
      },
      sortable: false,
      width: 40,
    },
    {
      disableColumnMenu: true,
      field: 'title',
      flex: 2,
      headerName: intl.formatMessage({
        id: 'pages.people.views.viewsList.columns.title',
      }),
      renderCell: (params) => {
        if (params.row.type == 'back') {
          const subPath = params.row.folderId
            ? 'folders/' + params.row.folderId
            : '';

          return (
            <NextLink href={`${basePath}/${subPath}`} passHref>
              <Link className={styles.itemLink}>
                {params.row.title ? (
                  <FormattedMessage
                    id="pages.people.views.browser.backToFolder"
                    values={{ folder: <em>{params.row.title}</em> }}
                  />
                ) : (
                  <FormattedMessage id="pages.people.views.browser.backToRoot" />
                )}
              </Link>
            </NextLink>
          );
        } else {
          return (
            <NextLink href={`${basePath}/${params.row.id}`} passHref>
              <Link className={styles.itemLink}>{params.row.title}</Link>
            </NextLink>
          );
        }
      },
    },
    {
      disableColumnMenu: true,
      field: 'owner',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.people.views.viewsList.columns.owner',
      }),
      valueGetter: (params) =>
        params.row.type == 'back' ? '' : params.row.owner,
    },
  ];

  return (
    <ZUIFuture future={model.getItems(folderId)}>
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
          <DataGridPro
            autoHeight
            columns={colDefs}
            disableSelectionOnClick
            hideFooter
            onSortModelChange={(model) => setSortModel(model)}
            rows={rows}
            sortingMode="server"
            sx={{ borderWidth: 0 }}
          />
        );
      }}
    </ZUIFuture>
  );
};

export default ViewBrowser;
