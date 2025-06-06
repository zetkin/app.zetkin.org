'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, Suspense } from 'react';
import NextLink from 'next/link';
import { NorthWest } from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import messageIds from '../../organizations/l10n/messageIds';
import useUser from 'core/hooks/useUser';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';
import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIOldAvatar from 'zui/ZUIAvatar';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';
import useMembership from '../../organizations/hooks/useMembership';
import useConnectOrg from '../../organizations/hooks/useConnectOrg';

type Props = {
  children: ReactNode;
  org: ZetkinOrganization;
  proj: ZetkinCampaign;
};

const ProjHomeLayout: FC<Props> = ({ children, org, proj }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  const user = useUser();
  const membership = useMembership(org.id).data;

  const { connectOrg } = useConnectOrg(org.id);

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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            mx: 2,
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <ZUIOldAvatar size="md" url={`/api/orgs/${org.id}/avatar`} />
            <ZUIText variant="headingLg">{org.title}</ZUIText>

            {user && !membership && (
              <ZUIButton
                label={messages.home.header.connect()}
                onClick={() => connectOrg()}
              />
            )}
            {!user && (
              <ZUIButton
                href={`/login?redirect=${encodeURIComponent(`/o/${org.id}`)}`}
                label={messages.home.header.login()}
              />
            )}
          </Box>
          {user && (
            <NextLink href="/my">
              <ZUIPersonAvatar
                firstName={user.first_name}
                id={user.id}
                lastName={user.last_name}
              />
            </NextLink>
          )}
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            mx: 2,
            my: 1,
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <ZUIText variant="headingLg">{proj.title}</ZUIText>
            <ZUIText>{proj.info_text}</ZUIText>
          </Box>
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

export default ProjHomeLayout;
