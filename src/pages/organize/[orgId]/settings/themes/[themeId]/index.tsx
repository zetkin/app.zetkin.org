import { GetServerSideProps } from 'next';
import { Box, Stack } from '@mui/material';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import ThemeEditor from 'features/emails/components/ThemeEditor/ThemeEditor';
import { useNumericRouteParams } from 'core/hooks';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

interface ThemePageProps {
  orgId: string;
}

const ThemePage: PageWithLayout<ThemePageProps> = () => {
  const onServer = useServerSide();
  const { orgId, themeId } = useNumericRouteParams();

  if (onServer) {
    return null;
  }

  return (
    <Stack direction="row" display="flex" gap={2}>
      <Box sx={{ flex: 1, minWidth: '0' }}>
        <ThemeEditor orgId={orgId} selectedBlockIndex={0} themeId={themeId} />
      </Box>
      <Box sx={{ flex: 1, minWidth: '0' }} />
    </Stack>
  );
};

ThemePage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default ThemePage;
