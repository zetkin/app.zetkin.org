'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useUser from 'core/hooks/useUser';
import ZUITabbedNavBar from 'zui/components/ZUITabbedNavBar';
import ZUIText from 'zui/components/ZUIText';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';

type Props = {
  children: ReactNode;
  title?: string;
};

const HomeLayout: FC<Props> = ({ children, title }) => {
  const messages = useMessages(messageIds);

  const path = usePathname();
  const lastSegment = path?.split('/').pop() ?? 'home';

  const user = useUser();

  return (
    <Box
      sx={{
        marginX: 'auto',
        maxWidth: 640,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          margin: 2,
        }}
      >
        <ZUIText variant="headingLg">{title || messages.title()}</ZUIText>
        {user && (
          <Box sx={{ cursor: 'default' }}>
            <ZUIPersonAvatar
              firstName={user.first_name}
              id={user.id}
              lastName={user.last_name}
            />
          </Box>
        )}
      </Box>
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.default,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        })}
      >
        <ZUITabbedNavBar
          items={[
            {
              href: `/my/home`,
              label: messages.tabs.home(),
              value: 'home',
            },
            {
              href: `/my/feed`,
              label: messages.tabs.feed(),
              value: 'feed',
            },
            {
              href: `/my/settings`,
              label: messages.tabs.settings(),
              value: 'settings',
            },
          ]}
          selectedTab={lastSegment}
        />
      </Box>
      <Box minHeight="90dvh">{children}</Box>
      <ZUIPublicFooter />
    </Box>
  );
};

export default HomeLayout;
