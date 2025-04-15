'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIAvatar from 'zui/components/ZUIAvatar';
import useUser from 'core/hooks/useUser';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';
import ZUITabbedNavBar from 'zui/components/ZUITabbedNavBar';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';

type Props = {
  children: ReactNode;
  title?: string;
};

const HomeLayout: FC<Props> = ({ children, title }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

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
            <ZUIAvatar
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
      <Box
        alignItems="center"
        component="footer"
        display="flex"
        flexDirection="column"
        mx={1}
        my={2}
        sx={{ opacity: 0.75 }}
      >
        <ZUILogo />
        <ZUIText variant="bodySmRegular">Zetkin</ZUIText>
        <ZUILink
          href={
            env.vars.ZETKIN_PRIVACY_POLICY_LINK ||
            'https://www.zetkin.org/privacy'
          }
          size="small"
          text={messages.footer.privacyPolicy()}
        />
      </Box>
    </Box>
  );
};

export default HomeLayout;
