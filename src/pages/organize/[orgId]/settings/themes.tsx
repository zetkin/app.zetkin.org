import { GetServerSideProps } from 'next';
import { Box, Button, Typography } from '@mui/material';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import { Msg } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import useCreateEmailTheme from 'features/emails/hooks/useCreateEmailTheme';

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
  const { createEmailTheme } = useCreateEmailTheme(orgId);

  if (onServer) {
    return null;
  }

  return (
    <Box>
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
    </Box>
  );
};

ThemesSettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default ThemesSettingsPage;
