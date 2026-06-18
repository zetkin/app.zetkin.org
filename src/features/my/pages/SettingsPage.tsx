'use client';

import { Box, Stack } from '@mui/material';
import { FC, Suspense } from 'react';

import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AppPreferences from 'features/my/components/AppPreferences';
import AccountSettings from 'features/my/components/AccountSettings';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import EmailSettings from '../components/EmailSettings';

const SettingsPage: FC = () => {
  const user = useCurrentUser();

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={2}
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {user && (
        <Stack gap={2} sx={{ paddingTop: 2 }}>
          <AppPreferences user={user} />
          <AccountSettings user={user} />
          <EmailSettings />
        </Stack>
      )}
    </Suspense>
  );
};

export default SettingsPage;
