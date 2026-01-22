'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AppPreferences from '../../public/components/AppPreferences';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AccountSettings from '../../public/components/AccountSettings';

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
