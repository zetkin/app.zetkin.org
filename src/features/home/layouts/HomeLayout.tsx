'use client';

import { Box, Link, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIAvatar from 'zui/ZUIAvatar';
import useUser from 'core/hooks/useUser';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';

type Props = {
  children: ReactNode;
};

const HomeLayout: FC<Props> = ({ children }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  const path = usePathname();
  const lastSegment = path?.split('/').pop() ?? 'home';

  const isMobile = useMediaQuery('(max-width: 640px)');

  const user = useUser();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100dvh"
      sx={{
        marginX: 'auto',
        maxWidth: 640,
      }}
    >
      <Box display="flex" justifyContent="space-between" m={2}>
        <Typography>Zetkin</Typography>
        {user && <ZUIAvatar size="sm" url={`/api/users/${user.id}/avatar`} />}
      </Box>
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.default,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        })}
      >
        <Tabs centered={isMobile} value={lastSegment}>
          <Tab
            component={NextLink}
            href="/my/home"
            label={messages.tabs.home()}
            value="home"
          />
          <Tab
            component={NextLink}
            href="/my/feed"
            label={messages.tabs.feed()}
            value="feed"
          />
        </Tabs>
      </Box>
      <Box flexGrow={1}>{children}</Box>
      <Box
        alignItems="center"
        component="footer"
        display="flex"
        flexDirection="column"
        mx={1}
        my={2}
        sx={{ opacity: 0.5 }}
      >
        <ZUILogo />
        <Typography variant="body2">Zetkin</Typography>
        <Typography variant="body2">
          <Link
            href={
              env.vars.ZETKIN_PRIVACY_POLICY_LINK ||
              'https://www.zetkin.org/privacy'
            }
          >
            <Msg id={messageIds.footer.privacyPolicy} />
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeLayout;
