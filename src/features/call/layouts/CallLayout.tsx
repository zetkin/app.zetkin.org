'use client';

import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  children?: ReactNode;
};

const CallLayout: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Link href="/my/home" passHref>
          <Button variant="outlined">
            <Msg id={messageIds.nav.backToHome} />
          </Button>
        </Link>
        <Button variant="contained">
          <Msg id={messageIds.nav.startCalling} />
        </Button>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
