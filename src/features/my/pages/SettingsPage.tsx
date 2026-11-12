'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import useCurrentUser from 'features/user/hooks/useCurrentUser';
import AppPreferences from 'features/my/components/AppPreferences';
import AccountSettings from 'features/my/components/AccountSettings';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import EmailPreferences from '../components/EmailPreferences';
import useIsMobile from 'utils/hooks/useIsMobile';

const AllEventsPage: FC = () => {
  const user = useCurrentUser();
  const isMobile = useIsMobile();

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            paddingX: isMobile ? 2 : 0,
            paddingY: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <AppPreferences user={user} />
            <AccountSettings user={user} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <EmailPreferences user={user} />
          </Box>
        </Box>
      )}
    </Suspense>
  );
};

export default AllEventsPage;
