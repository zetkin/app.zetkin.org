import { FC } from 'react';
import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import {
  ArrowBack,
  Folder,
  InsertDriveFileOutlined,
} from '@mui/icons-material';

import ViewBrowserModel, { ViewBrowserItem } from '../models/ViewBrowserModel';
import { ViewTreeItem } from 'pages/api/views/tree';
import ZUIFuture from 'zui/ZUIFuture';

interface ViewBrowserProps {
  basePath: string;
  folderId?: number | null;
  model: ViewBrowserModel;
}

const ViewBrowser: FC<ViewBrowserProps> = ({
  basePath,
  folderId = null,
  model,
}) => {
  const intl = useIntl();

  const colDefs: GridColDef<ViewBrowserItem>[] = [
    {
      field: 'icon',
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
    },
    {
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
              <Link>
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
              <Link>{params.row.title}</Link>
            </NextLink>
          );
        }
      },
    },
    {
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
      {(data) => (
        <DataGridPro autoHeight columns={colDefs} hideFooter rows={data} />
      )}
    </ZUIFuture>
  );
};

export default ViewBrowser;
