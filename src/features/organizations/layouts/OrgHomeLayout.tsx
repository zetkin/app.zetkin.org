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
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const OrgHomeLayout: FC<Props> = ({ children, org }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  const path = usePathname();
  const lastSegment = path?.split('/')[3] ?? 'home';

  const isMobile = useMediaQuery('(max-width: 640px)');

  const user = useUser();

  return (
    <Box
      sx={{
        marginX: 'auto',
        maxWidth: 960,
      }}
    >
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.grey[300],
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 10,
        })}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <ZUIAvatar size="sm" url={`/api/orgs/${org.id}/avatar`} />
            <Typography>{org.title}</Typography>
          </Box>
          {user && (
            <NextLink href="/my">
              <ZUIAvatar size="sm" url={`/api/users/${user.id}/avatar`} />
            </NextLink>
          )}
        </Box>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Tabs
            centered={isMobile}
            sx={{
              '& .MuiTabs-indicator > span': {
                backgroundColor: '#252525',
              },
            }}
            value={lastSegment}
            variant={isMobile ? 'fullWidth' : 'standard'}
          >
            <Tab
              component={NextLink}
              href={`/o/${org.id}`}
              label={messages.home.tabs.calendar()}
              sx={{ textTransform: 'none' }}
              value="home"
            />
            <Tab
              component={NextLink}
              href={`/o/${org.id}/suborgs`}
              label={messages.home.tabs.suborgs()}
              sx={{ textTransform: 'none' }}
              value="suborgs"
            />
          </Tabs>
        </Box>
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
        <Typography variant="body2">Zetkin</Typography>
        <Typography variant="body2">
          <Link
            href={
              env.vars.ZETKIN_PRIVACY_POLICY_LINK ||
              'https://www.zetkin.org/privacy'
            }
          >
            <Msg id={messageIds.home.footer.privacyPolicy} />
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default OrgHomeLayout;
