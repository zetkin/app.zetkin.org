'use client';

import { FC, Suspense } from 'react';
import { Box, NoSsr } from '@mui/material';

import MyOrgsList from '../components/MyOrgsList';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

const MyOrgsPage: FC = () => {
  return (
    <NoSsr>
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
        <MyOrgsList />
      </Suspense>
    </NoSsr>
  );
};

export default MyOrgsPage;
