import { GetServerSideProps } from 'next';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from 'features/settings/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import RoleAddPersonButton from 'features/settings/components/RoleAddPersonButton';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useRoles from 'features/settings/hooks/useRoles';
import useRolesMutations from 'features/settings/hooks/useRolesMutations';
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
  const { demoteAdmin, promoteOrganizer, removeAccess } =
    useRolesMutations(orgId);
  const user = useCurrentUser();

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
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'cancel',
      flex: 1,
      headerName: '',
      minWidth: 300,
      renderCell: (params) => {
        if (params.row.id === user?.id) {
          return <Typography>{messages.you()}</Typography>;
        } else if (params.row.role === 'admin') {
          return (
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button onClick={() => demoteAdmin(params.row.id)} size="small">
                <ArrowDownward />
                {messages.tableButtons.demote()}
              </Button>
              <Button
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.tableButtons.remove()}
              </Button>
            </FormControl>
          );
        } else {
          return (
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => promoteOrganizer(params.row.id)}
                size="small"
              >
                <ArrowUpward />
                {messages.tableButtons.promote()}
              </Button>
              <Button
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.tableButtons.remove()}
              </Button>
            </FormControl>
          );
        }
      },
    },
  ];

  return (
    <Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        sx={{
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography variant="h4">
          <Msg id={messageIds.administrators.title} />
        </Typography>
        <RoleAddPersonButton
          disabledList={adminRoles}
          orgId={orgId}
          roleType="admin"
        />
      </Box>
      <Typography mb={2} variant="body2">
        <Msg id={messageIds.administrators.description} />
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={adminRoles}
      />
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        sx={{
          marginBottom: '15px',
          marginTop: '40px',
        }}
      >
        <Typography variant="h4">
          <Msg id={messageIds.organizers.title} />
        </Typography>
        <RoleAddPersonButton
          disabledList={organizersRoles}
          orgId={orgId}
          roleType="organizer"
        />
      </Box>
      <Typography mb={2} variant="body2">
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
