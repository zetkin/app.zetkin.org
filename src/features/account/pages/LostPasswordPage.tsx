'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import LostPasswordSection from '../components/LostPasswordSection';

const LostPasswordPage: FC = () => {
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
      <LostPasswordSection />
    </Suspense>
  );
};

export default LostPasswordPage;
