import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { OpenInNew } from '@mui/icons-material';
import { Box, Grid, Link, Typography } from '@mui/material';

import AddOfficialButton from 'features/settings/components/AddOfficialButton';
import messageIds from 'features/settings/l10n/messageIds';
import OfficialList from 'features/settings/components/OfficialList';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import { useEnv } from 'core/hooks';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useOfficialMemberships from 'features/settings/hooks/useOfficialMemberships';
import useServerSide from 'core/useServerSide';
import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

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
  const {
    data: memberships,
    error: membershipsError,
    isLoading: membershipsLoading,
  } = useOfficialMemberships(orgId);
  const messages = useMessages(messageIds);
  const env = useEnv();
  const publicOrgUrl = `${env.vars.ZETKIN_APP_DOMAIN}/o/${orgId}`;

  const [adminList, setAdminList] = useState<ZetkinMembership[] | null>(null);
  const [organizerList, setOrganizerList] = useState<ZetkinMembership[] | null>(
    null
  );

  useEffect(() => {
    if (!membershipsLoading && memberships && !adminList && !organizerList) {
      setAdminList(memberships.filter((user) => user.role === 'admin'));
      setOrganizerList(memberships.filter((user) => user.role === 'organizer'));
    }
  }, [memberships, membershipsLoading, adminList, organizerList]);

  useEffect(() => {
    if (membershipsError) {
      // showError;
    }
  }, [membershipsError]);

  if (onServer) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 8 }}>
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
          {!membershipsLoading && (
            <AddOfficialButton
              disabledList={adminList || []}
              orgId={orgId}
              roleType="admin"
            />
          )}
        </Box>
        <Typography mb={2} variant="body2">
          <Msg id={messageIds.officials.administrators.description} />
        </Typography>
        {membershipsLoading ? (
          <ZUILogoLoadingIndicator />
        ) : (
          <OfficialList officialList={adminList || []} orgId={orgId} />
        )}
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
          {!membershipsLoading && (
            <AddOfficialButton
              disabledList={organizerList || []}
              orgId={orgId}
              roleType="organizer"
            />
          )}
        </Box>
        <Typography mb={2} variant="body2">
          <Msg id={messageIds.officials.organizers.description} />
        </Typography>
        {membershipsLoading ? (
          <ZUILogoLoadingIndicator />
        ) : (
          <OfficialList officialList={organizerList || []} orgId={orgId} />
        )}
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
