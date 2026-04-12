import { GetServerSideProps } from 'next';
import { Box, CircularProgress, Stack } from '@mui/material';
import React from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import EmailThemeLayout from 'features/emails/layout/EmailThemeLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemeEditor from 'features/emails/components/ThemeEditor/ThemeEditor';

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
  const { isLoading } = useEmailTheme(orgId, themeId);

  if (onServer) {
    return null;
  }
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" display="flex" gap={2}>
      <Box sx={{ flex: 1, minWidth: '0' }}>
        <ThemeEditor editingSection="css" orgId={orgId} themeId={themeId} />
      </Box>
      <Box sx={{ flex: 1, minWidth: '0' }} />
    </Stack>
  );
};

ThemePage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemePage;
