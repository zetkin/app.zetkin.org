import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from 'features/settings/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useRoles from 'features/settings/hooks/useRoles';
import useServerSide from 'core/useServerSide';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Msg, useMessages } from 'core/i18n';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
  }
);

const SettingsPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const roles = useRoles(orgId).data || [];
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }
  const adminRoles = roles.filter((user) => user.role === 'admin');
  const organizersRoles = roles.filter((user) => user.role === 'organizer');

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
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography mr={2} variant="h4">
          <Msg id={messageIds.administrators.title} />
        </Typography>
      </Box>
      <Typography mb={2} variant="body1">
        <Msg id={messageIds.administrators.description} />
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={adminRoles}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography mr={2} variant="h4">
          <Msg id={messageIds.organizers.title} />
        </Typography>
      </Box>
      <Typography mb={2} variant="body1">
        <Msg id={messageIds.organizers.description} />
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={organizersRoles}
      />
    </Box>
  );
};

SettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default SettingsPage;
