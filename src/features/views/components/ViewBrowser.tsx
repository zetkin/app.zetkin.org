import { FC } from 'react';
import { Link } from '@mui/material';
import NextLink from 'next/link';
import { useIntl } from 'react-intl';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Folder, InsertDriveFileOutlined } from '@mui/icons-material';

import ViewBrowserModel from '../models/ViewBrowserModel';
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

  const colDefs: GridColDef<ViewTreeItem>[] = [
    {
      field: 'icon',
      headerName: '',
      renderCell: (params) => {
        return params.row.type == 'folder' ? (
          <Folder />
        ) : (
          <InsertDriveFileOutlined />
        );
      },
    },
    {
      field: 'title',
      flex: 2,
      headerName: intl.formatMessage({
        id: 'pages.people.views.viewsList.columns.title',
      }),
      renderCell: (params) => {
        return (
          <NextLink href={`${basePath}/${params.row.id}`} passHref>
            <Link>{params.row.title}</Link>
          </NextLink>
        );
      },
    },
    {
      field: 'owner',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.people.views.viewsList.columns.owner',
      }),
      valueGetter: (params) => params.row.owner,
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
