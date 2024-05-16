import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import RolesTable from './RolesTable';
import { useMessages } from 'core/i18n';
import useRoles from '../hooks/useRoles';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type RolesListProps = {
  orgId: number;
};

const RolesList: FC<RolesListProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const roles = useRoles(orgId);

  const adminRoles = roles?.data?.filter((user) => user.role === 'admin');
  const organizersRoles = roles?.data?.filter(
    (user) => user.role === 'organizer'
  );

  const columnsAdmin: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'avatar',
      headerName: messages.administrators.columns.name(),
      hideSortIcons: true,
      minWidth: 250,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.id} />
          <Typography
            sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
          >
            {params.row.first_name + ' ' + params.row.last_name}
          </Typography>
        </ZUIPersonHoverCard>
      ),
      resizable: true,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'role',
      flex: 1,
      headerName: messages.administrators.columns.inheritance(),
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.role}
        </Typography>
      ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
    },
  ];

  const columnsOrg: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'avatar',
      headerName: messages.administrators.columns.name(),
      hideSortIcons: true,
      minWidth: 250,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.id} />
          <Typography
            sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
          >
            {params.row.first_name + ' ' + params.row.last_name}
          </Typography>
        </ZUIPersonHoverCard>
      ),
      resizable: true,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'role',
      flex: 1,
      headerName: messages.administrators.columns.inheritance(),
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.role}
        </Typography>
      ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
    },
  ];

  return (
    <>
      <RolesTable
        columns={columnsAdmin}
        description={messages.administrators.description()}
        rows={adminRoles}
        title={messages.administrators.title()}
      />

      <RolesTable
        columns={columnsOrg}
        description={messages.organizers.description()}
        rows={organizersRoles}
        title={messages.organizers.title()}
      />
    </>
  );
};

export default RolesList;
