'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AppPreferences from '../components/AppPreferences';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AccountSettings from '../components/AccountSettings';

const SettingsContent: FC = () => {
  const user = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <AppPreferences user={user} />
      <AccountSettings user={user} />
    </>
  );
};

const AllEventsPage: FC = () => {
  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      <SettingsContent />
    </Suspense>
  );
};

export default AllEventsPage;
