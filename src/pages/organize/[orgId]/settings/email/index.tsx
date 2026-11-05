import { GetServerSideProps } from 'next';
import { Box, Button, Grid, Typography } from '@mui/material';
import Head from 'next/head';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import ThemeCard from 'features/settings/components/themes/ThemeCard';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useCreateEmailTheme from 'features/settings/hooks/useCreateEmailTheme';
import EmailChannelSettings from 'features/settings/components/channels/EmailChannelSettings';

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
  const messages = useMessages(messageIds);
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const themes = useEmailThemes(orgId).data || [];
  const createTheme = useCreateEmailTheme(orgId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.pageTitles.email()}</title>
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <EmailChannelSettings orgId={orgId} />
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
    </>
  );
};

EmailSettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default EmailSettingsPage;
