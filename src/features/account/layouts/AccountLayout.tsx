'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AccountLayout: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        p: { md: 2, xs: 0 },
      }}
    >
      <Box
        sx={{
          borderRadius: { md: 1, xs: 0 },
          display: 'flex',
          flexDirection: 'column',
          height: { md: 'auto', xs: '100vh' },
          maxWidth: { md: 600, xs: '100%' },
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AccountLayout;
