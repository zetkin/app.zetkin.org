'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import MyActivitiesList from '../components/MyActivitiesList';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

const HomePage: FC = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" my={6}>
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      <MyActivitiesList />
    </Suspense>
  );
};

export default HomePage;
