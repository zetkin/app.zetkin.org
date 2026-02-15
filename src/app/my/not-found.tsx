'use client';

import { Box } from '@mui/material';

import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

export default function MyNotFound() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        justifyContent: 'center',
        minHeight: '50dvh',
        px: 2,
      }}
    >
      <ZUIText color="secondary" variant="headingLg">
        404
      </ZUIText>
      <ZUIText variant="headingMd">Page not found</ZUIText>
      <Box mt={2}>
        <ZUIButton
          href="/my/home"
          label="Back to home page"
          variant="secondary"
        />
      </Box>
    </Box>
  );
}
