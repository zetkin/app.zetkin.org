'use client';

import { Box, Tab, Tabs, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIAvatar from 'zui/ZUIAvatar';
import useUser from 'core/hooks/useUser';

type Props = {
  children: ReactNode;
};

const HomeLayout: FC<Props> = ({ children }) => {
  const messages = useMessages(messageIds);

  const path = usePathname();
  const lastSegment = path?.split('/').pop() ?? 'home';

  const user = useUser();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" m={2}>
        <Typography>Zetkin</Typography>
        {user && <ZUIAvatar size="sm" url={`/api/users/${user.id}/avatar`} />}
      </Box>
      <Tabs value={lastSegment}>
        <Tab
          component={Link}
          href="/my/home"
          label={messages.tabs.home()}
          value="home"
        />
        <Tab
          component={Link}
          href="/my/feed"
          label={messages.tabs.feed()}
          value="feed"
        />
      </Tabs>
      {children}
    </Box>
  );
};

export default HomeLayout;
