import { GetServerSideProps } from 'next';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import useEmailThemeMutations from 'features/emails/hooks/useEmailThemeMutations';
import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import ThemeCard from 'features/emails/components/ThemeCard';

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
  const { createEmailTheme } = useEmailThemeMutations(orgId);
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
        <Button
          color="primary"
          onClick={() => {
            createEmailTheme().then();
          }}
          variant="contained"
        >
          <Msg id={messageIds.themes.overview.addTheme} />
        </Button>
      </Box>
      <Grid container spacing={2}>
        {themes.map((theme) => (
          <Grid key={theme.id} size={{ md: 6, xs: 6 }}>
            <ThemeCard orgId={orgId} themeId={theme.id} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

ThemesSettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default ThemesSettingsPage;
