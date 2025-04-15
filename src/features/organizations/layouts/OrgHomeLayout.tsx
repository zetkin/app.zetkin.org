'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { NorthWest } from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useUser from 'core/hooks/useUser';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';
import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITabbedNavBar from 'zui/components/ZUITabbedNavBar';
import ZUIOldAvatar from 'zui/ZUIAvatar';
import ZUIAvatar from 'zui/components/ZUIAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
};

const OrgHomeLayout: FC<Props> = ({ children, org }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  const path = usePathname();
  const lastSegment = path?.split('/')[3] ?? 'home';

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
          bgcolor: theme.palette.grey[100],
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        <Box sx={{ mb: 6, minHeight: 40, mt: 2, mx: 2, opacity: 0.7 }}>
          {org.parent && (
            <NextLink href={`/o/${org.parent.id}`} passHref>
              <ZUIButton label={org.parent.title} startIcon={NorthWest} />
            </NextLink>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <ZUIOldAvatar size="md" url={`/api/orgs/${org.id}/avatar`} />
            <ZUIText variant="headingLg">{org.title}</ZUIText>
          </Box>
          {user && (
            <NextLink href="/my">
              <ZUIAvatar
                firstName={user.first_name}
                id={user.id}
                lastName={user.last_name}
              />
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
          <ZUITabbedNavBar
            items={[
              {
                href: `/o/${org.id}`,
                label: messages.home.tabs.calendar(),
                value: 'home',
              },
              {
                href: `/o/${org.id}/suborgs`,
                label: messages.home.tabs.suborgs(),
                value: 'suborgs',
              },
            ]}
            selectedTab={lastSegment}
          />
        </Box>
      </Box>
      <Suspense
        fallback={
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height="90dvh"
            justifyContent="center"
          >
            <ZUILogoLoadingIndicator />
          </Box>
        }
      >
        <Box minHeight="90dvh">{children}</Box>
      </Suspense>
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
          text={messages.home.footer.privacyPolicy()}
        />
      </Box>
    </Box>
  );
};

export default OrgHomeLayout;
