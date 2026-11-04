'use client';

import { Avatar, Box } from '@mui/material';
import { FC, useMemo } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import useUsers from 'features/manage/hooks/useUsers';
import { ZetkinUser } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';

const ManageUsersPage: FC = () => {
  const messages = useMessages(messageIds);

  const users = useUsers();

  const columns: GridColDef<ZetkinUser>[] = useMemo(() => {
    const columns: GridColDef<ZetkinUser>[] = [
      {
        disableColumnMenu: true,
        field: 'avatar',
        filterable: false,
        headerName: '',
        renderCell: ({ row }) => {
          return (
            <Box
              alignItems="center"
              display="flex"
              height="100%"
              justifyContent="center"
              width="100%"
            >
              <Avatar
                src={`/api/users/${row.id}/avatar`}
                sx={{ height: '30px', width: '30px' }}
              />
            </Box>
          );
        },
        sortable: false,
        width: 20,
      },
      {
        field: 'name',
        flex: 1,
        headerName: messages.users.columns.name(),
        minWidth: 200,
        valueGetter: (_, row) => `${row.first_name} ${row.last_name}`,
      },
      {
        field: 'email',
        flex: 1,
        headerName: messages.users.columns.email(),
        minWidth: 200,
      },
      {
        disableColumnMenu: true,
        field: 'action',
        filterable: false,
        headerName: '',
        minWidth: 140,
        renderCell: ({ row }) => {
          return (
            <Box
              alignItems="center"
              display="flex"
              height="100%"
              justifyContent="center"
              width="100%"
            >
              <ZUIButton
                href={`/manage/users/${row.id}`}
                label={messages.users.manage()}
                variant="secondary"
              />
            </Box>
          );
        },
        sortable: false,
      },
    ];
    return columns;
  }, [messages.users]);

  return (
    <Box overflow="hidden">
      <DataGridPro columns={columns} rows={users} />
    </Box>
  );
};

export default ManageUsersPage;
