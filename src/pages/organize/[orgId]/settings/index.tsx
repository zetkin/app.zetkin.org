import { GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import AddOfficialButton from 'features/settings/components/AddOfficialButton';
import messageIds from 'features/settings/l10n/messageIds';
import { Msg } from 'core/i18n';
import OfficialList from 'features/settings/components/OfficialList';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useOfficialMemberships from 'features/settings/hooks/useOfficialMemberships';
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
  const listFuture = useOfficialMemberships(orgId).data || [];

  const adminList = listFuture.filter((user) => user.role === 'admin');
  const organizerList = listFuture.filter((user) => user.role === 'organizer');

  if (onServer) {
    return null;
  }

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
          <Msg id={messageIds.officials.administrators.title} />
        </Typography>
        <AddOfficialButton
          disabledList={adminList}
          orgId={orgId}
          roleType="admin"
        />
      </Box>
      <Typography mb={2} variant="body2">
        <Msg id={messageIds.officials.administrators.description} />
      </Typography>
      <OfficialList officialList={adminList} orgId={orgId} />
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
          <Msg id={messageIds.officials.organizers.title} />
        </Typography>
        <AddOfficialButton
          disabledList={organizerList}
          orgId={orgId}
          roleType="organizer"
        />
      </Box>
      <Typography mb={2} variant="body2">
        <Msg id={messageIds.officials.organizers.description} />
      </Typography>
      <OfficialList officialList={organizerList} orgId={orgId} />
    </Box>
  );
};

SettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default SettingsPage;
