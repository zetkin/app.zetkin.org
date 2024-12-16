'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllEventsList from '../components/AllEventsList';

const AllEventsPage: FC = () => {
  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      <AllEventsList />
    </Suspense>
  );
};

export default AllEventsPage;
