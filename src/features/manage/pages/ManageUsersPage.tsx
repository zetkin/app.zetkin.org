'use client';

import { Avatar, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { FC, useMemo, useState } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import useUserSearch from 'features/manage/hooks/useUserSearch';
import { ZetkinUser } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIHeader from 'zui/components/ZUIHeader';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIAlert from 'zui/components/ZUIAlert';

const actionColumnWidth = 140;

export const ManageUsersError = () => {
  const messages = useMessages(messageIds);

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <ZUIAlert severity={'error'} title={messages.users.errorLoadingPage()} />
    </Box>
  );
};

const ManageUsersPage: FC = () => {
  const messages = useMessages(messageIds);

  const [query, setQuery] = useState('');
  const { error, isLoading, users } = useUserSearch(query);

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
        minWidth: actionColumnWidth,
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
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: '1rem',
        minHeight: 0,
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      <ZUIHeader
        belowActionButton={
          <ZUITextField
            label={messages.users.search.label()}
            onChange={setQuery}
            startIcon={Search}
            value={query}
          />
        }
        title={messages.users.title()}
      />
      {!!error && <ManageUsersError />}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <DataGridPro
          columns={columns}
          loading={isLoading}
          localeText={{
            noRowsLabel: query.trim()
              ? messages.users.search.noResults()
              : messages.users.search.prompt(),
          }}
          rows={users}
        />
      </Box>
    </Box>
  );
};

export default ManageUsersPage;
