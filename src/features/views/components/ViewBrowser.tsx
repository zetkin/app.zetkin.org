import { FC } from 'react';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { Link } from '@mui/material';
import NextLink from 'next/link';
import { useIntl } from 'react-intl';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import ViewBrowserModel from '../models/ViewBrowserModel';
import { ZetkinView } from './types';
import ZUIFuture from 'zui/ZUIFuture';

interface ViewBrowserProps {
  basePath: string;
  model: ViewBrowserModel;
}

const ViewBrowser: FC<ViewBrowserProps> = ({ basePath, model }) => {
  const intl = useIntl();

  const colDefs: GridColDef<ZetkinView>[] = [
    {
      field: 'icon',
      headerName: '',
      renderCell: () => {
        return <InsertDriveFileOutlined />;
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
      valueGetter: (params) => params.row.owner.name,
    },
  ];
  return (
    <ZUIFuture future={model.getViews()}>
      {(data) => (
        <DataGridPro autoHeight columns={colDefs} hideFooter rows={data} />
      )}
    </ZUIFuture>
  );
};

export default ViewBrowser;
