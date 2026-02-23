import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode, Suspense } from 'react';

type Props = { children: ReactNode };

export default function SuspenseWithCircularLoader({ children }: Props) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}
