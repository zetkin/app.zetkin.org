'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import MyActivitiesList from '../components/MyActivitiesList';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

const HomePage: FC = () => {
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
      <MyActivitiesList />
    </Suspense>
  );
};

export default HomePage;
