import { GetServerSideProps } from 'next';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { Fragment } from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import { Msg } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import ThemeCard from 'features/settings/components/themes/ThemeCard';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useCreateEmailTheme from 'features/settings/hooks/useCreateEmailTheme';
import useEmailConfigs from 'features/emails/hooks/useEmailConfigs';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type Props = {
  orgId: string;
};

const EmailSettingsPage: PageWithLayout<Props> = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const themes = useEmailThemes(orgId).data || [];
  const createTheme = useCreateEmailTheme(orgId);
  const channels = useEmailConfigs(orgId).data || [];

  if (onServer) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4">
            <Msg id={messageIds.email.channels.overview.title} />
          </Typography>
        </Box>
        <Typography>
          <Msg id={messageIds.email.channels.overview.description} />
        </Typography>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.common.white,
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: 1,
          })}
        >
          <Box sx={{ display: 'flex', padding: 2 }}>
            <Typography sx={{ flex: 1 }} variant="h5">
              <Msg id={messageIds.email.channels.list.headers.senderName} />
            </Typography>
            <Typography sx={{ flex: 1 }} variant="h5">
              <Msg id={messageIds.email.channels.list.headers.senderEmail} />
            </Typography>
            <Typography sx={{ flex: 1 }} variant="h5">
              <Msg id={messageIds.email.channels.list.headers.noReply} />
            </Typography>
          </Box>
          <Divider />
          {channels.map((channel) => (
            <Fragment key={channel.id}>
              <Box sx={{ display: 'flex', padding: 2 }}>
                <Typography sx={{ flex: 1 }}>{channel.sender_name}</Typography>
                <Typography color="secondary" sx={{ flex: 1 }}>
                  {channel.sender_email}
                </Typography>
                <Typography color="secondary" sx={{ flex: 1 }}>
                  {channel.no_reply ? (
                    <Msg
                      id={messageIds.email.channels.list.noReply.canNotRespond}
                    />
                  ) : (
                    <Msg
                      id={messageIds.email.channels.list.noReply.canRespond}
                    />
                  )}
                </Typography>
              </Box>
              <Divider />
            </Fragment>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4">
            <Msg id={messageIds.email.themes.overview.title} />
          </Typography>
          <Button onClick={() => createTheme()} variant="outlined">
            <Msg id={messageIds.email.themes.addTheme} />
          </Button>
        </Box>
        <Typography>
          <Msg id={messageIds.email.themes.overview.description} />
        </Typography>
        <Grid container spacing={2}>
          {themes
            .sort((a, b) => a.id - b.id)
            .map((theme) => (
              <Grid key={theme.id} size={{ md: 6, sm: 6, xs: 12 }}>
                <Box sx={{ height: '100%' }}>
                  <ThemeCard orgId={orgId} themeId={theme.id} />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

EmailSettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default EmailSettingsPage;
