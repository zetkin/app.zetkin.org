'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllEventsList from '../components/AllEventsList';
import useAllEvents from '../../events/hooks/useAllEvents';

const AllEventsPage: FC = () => {
  const allEvents = useAllEvents();
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
      <AllEventsList events={allEvents} />
    </Suspense>
  );
};

export default AllEventsPage;
