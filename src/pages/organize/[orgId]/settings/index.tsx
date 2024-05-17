import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/settings/l10n/messageIds';
import { Msg } from 'core/i18n';
import OfficialList from 'features/settings/components/OfficialList';
import { PageWithLayout } from 'utils/types';
import RoleAddPersonButton from 'features/settings/components/RoleAddPersonButton';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useRoles from 'features/settings/hooks/useRoles';
import useServerSide from 'core/useServerSide';

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

  if (onServer) {
    return null;
  }
  const adminRoles = roles.filter((user) => user.role === 'admin');
  const organizersRoles = roles.filter((user) => user.role === 'organizer');

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
      <OfficialList officialList={adminRoles} orgId={orgId} />
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
      <OfficialList officialList={organizersRoles} orgId={orgId} />
    </Box>
  );
};

SettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default SettingsPage;
