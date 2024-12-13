'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllEventsList from '../components/AllEventsList';

const AllEventsPage: FC = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" my={6}>
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      <AllEventsList />
    </Suspense>
  );
};

export default AllEventsPage;
