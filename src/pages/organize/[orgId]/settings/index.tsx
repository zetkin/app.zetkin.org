import { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { OpenInNew } from '@mui/icons-material';
import { Box, Grid, Link, Skeleton, Typography } from '@mui/material';

import AddOfficialButton from 'features/settings/components/AddOfficialButton';
import messageIds from 'features/settings/l10n/messageIds';
import OfficialList from 'features/settings/components/OfficialList';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useOfficialMemberships from 'features/settings/hooks/useOfficialMemberships';
import useServerSide from 'core/useServerSide';
import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
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
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const publicOrgUrl = `${location.protocol}//${location.host}/o/${orgId}`;

  const { data: memberships, isLoading: membershipsLoading } =
    useOfficialMemberships(orgId);
  const [admins, organizers] = useMemo(() => {
    const admins = memberships?.filter((user) => user.role === 'admin') || [];
    const organizers =
      memberships?.filter((user) => user.role === 'organizer') || [];
    return [admins, organizers];
  }, [memberships]);

  if (onServer) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid
        size={{ md: 8 }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingBottom: 2,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4">
                <Msg id={messageIds.officials.administrators.title} />
              </Typography>
              <AddOfficialButton
                disabled={membershipsLoading}
                orgId={orgId}
                peopleToDisable={admins}
                roleType="admin"
              />
            </Box>
            <Typography variant="body2">
              <Msg id={messageIds.officials.administrators.description} />
            </Typography>
          </Box>
          {membershipsLoading ? (
            <Skeleton sx={{ height: '156px', transform: 'scale(1)' }} />
          ) : (
            <OfficialList
              emptyListMessage={messages.officials.administrators.empty()}
              officialList={admins}
              orgId={orgId}
            />
          )}
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingBottom: 2,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4">
                <Msg id={messageIds.officials.organizers.title} />
              </Typography>
              <AddOfficialButton
                disabled={membershipsLoading}
                orgId={orgId}
                peopleToDisable={organizers}
                roleType="organizer"
              />
            </Box>
            <Typography variant="body2">
              <Msg id={messageIds.officials.organizers.description} />
            </Typography>
          </Box>
          {membershipsLoading ? (
            <Skeleton sx={{ height: '156px', transform: 'scale(1)' }} />
          ) : (
            <OfficialList
              emptyListMessage={messages.officials.organizers.empty()}
              officialList={organizers}
              orgId={orgId}
            />
          )}
        </Box>
      </Grid>
      <Grid size={{ md: 4 }}>
        <ZUICard
          header={messages.officials.urlCard.linkToPub()}
          subheader={messages.officials.urlCard.subTitle()}
        >
          <Box display="flex" paddingBottom={2}>
            <ZUITextfieldToClipboard copyText={publicOrgUrl}>
              {publicOrgUrl}
            </ZUITextfieldToClipboard>
          </Box>
          <Link
            display="flex"
            href={publicOrgUrl}
            sx={{ alignItems: 'center', gap: 1 }}
            target="_blank"
          >
            <OpenInNew fontSize="inherit" />
            {messages.officials.urlCard.linkToPub()}
          </Link>
        </ZUICard>
      </Grid>
    </Grid>
  );
};

SettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default SettingsPage;
