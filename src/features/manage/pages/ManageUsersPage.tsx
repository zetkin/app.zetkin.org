'use client';

import { Avatar, Box, Skeleton } from '@mui/material';
import { FC, useMemo } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import useUsers from 'features/manage/hooks/useUsers';
import { ZetkinUser } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIButton from 'zui/components/ZUIButton';
import range from 'utils/range';
import ZUIAlert from 'zui/components/ZUIAlert';

const skeletonHeight = '2.7rem';
const actionColumnWidth = 140;

const ManageUsersSkeletonRow = ({
  height,
  isHeader,
}: {
  height?: string;
  isHeader?: boolean;
}) => {
  const rowHeight = height ?? skeletonHeight;

  return (
    <Box display="flex" flexDirection="row" gap="1rem">
      {isHeader ? (
        <Box height={rowHeight} width={skeletonHeight} />
      ) : (
        <Skeleton
          height={rowHeight}
          variant={'circular'}
          width={skeletonHeight}
        />
      )}
      <Skeleton
        height={rowHeight}
        sx={{
          flex: 1,
        }}
        variant={'rounded'}
      />
      <Skeleton
        height={rowHeight}
        sx={{
          flex: 1,
        }}
        variant={'rounded'}
      />
      {isHeader ? (
        <Box height={rowHeight} width={`${actionColumnWidth}px`} />
      ) : (
        <Skeleton
          height={rowHeight}
          variant={'rounded'}
          width={`${actionColumnWidth}px`}
        />
      )}
    </Box>
  );
};

export const ManageUsersSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <ManageUsersSkeletonRow height={'3.5rem'} isHeader={true} />
      {range(40).map((i) => (
        <ManageUsersSkeletonRow key={i} />
      ))}
    </Box>
  );
};

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
    <Box overflow="hidden">
      <DataGridPro columns={columns} rows={users} />
    </Box>
  );
};

export default ManageUsersPage;
