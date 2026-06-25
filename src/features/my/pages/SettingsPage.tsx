'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AppPreferences from 'features/my/components/AppPreferences';
import AccountSettings from 'features/my/components/AccountSettings';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

const AllEventsPage: FC = () => {
  const user = useCurrentUser();

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
      {user && (
        <>
          <AppPreferences user={user} />
          <AccountSettings user={user} />
        </>
      )}
    </Suspense>
  );
};

export default AllEventsPage;
