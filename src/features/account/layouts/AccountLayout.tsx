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
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          borderRadius: { md: 1, xs: 0 },
          display: 'flex',
          flexDirection: 'column',
          maxWidth: { md: 400, xs: '100%' },
          minHeight: { md: 'auto', xs: '100vh' },
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AccountLayout;
