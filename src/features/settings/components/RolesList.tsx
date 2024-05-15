import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import useRoles from '../hooks/useRoles';
import { useMessages } from 'core/i18n';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type RolesListProps = {
  orgId: number;
};

const RolesList: FC<RolesListProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const roles = useRoles(orgId);

  const adminRoles = roles?.data?.filter((user) => user.role === 'admin');

  const columns: GridColDef[] = [
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
      <Box
        sx={{
          '& div': { backgroundColor: 'transparent' },
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography mr={2} variant="h4">
          {messages.administrators.title()}
        </Typography>
      </Box>
      <Typography mb={2} variant="body1">
        {messages.administrators.description()}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={adminRoles ?? []}
        sx={{
          '& .MuiDataGrid-row:hover': {
            '&:hover svg': { display: 'inline-block' },
            cursor: 'pointer',
          },
        }}
      />
    </>
  );
};

export default RolesList;
