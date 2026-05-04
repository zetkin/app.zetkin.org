import { GetServerSideProps } from 'next';
import { Box, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import { Msg } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import ThemeCard from 'features/emails/components/ThemeCard';
import EmailThemeLayout from 'features/emails/layout/EmailThemeLayout';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

interface ThemesSettingsPageProps {
  orgId: string;
}

const ThemesSettingsPage: PageWithLayout<ThemesSettingsPageProps> = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const themes = useEmailThemes(orgId).data || [];

  if (onServer) {
    return null;
  }

  return (
    <Stack direction="column" display="flex" gap={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography>
          <Msg id={messageIds.themes.overview.description} />
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {themes.map((theme) => (
          <Grid key={theme.id} size={{ md: 6, sm: 6, xs: 12 }}>
            <Box sx={{ height: '100%' }}>
              <ThemeCard orgId={orgId} themeId={theme.id} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

ThemesSettingsPage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemesSettingsPage;
