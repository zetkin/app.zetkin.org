'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortlHeader';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  children: ReactNode;
  title?: string;
};

const HomeLayout: FC<Props> = ({ children, title }) => {
  const messages = useMessages(messageIds);

  const path = usePathname();
  const lastSegment = path?.split('/').pop() ?? 'home';

  return (
    <Box
      sx={{
        marginX: 'auto',
        maxWidth: 960,
      }}
    >
      <ActivistPortalHeader
        selectedTab={lastSegment}
        tabs={[
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
        topLeftComponent={
          <NextLink
            href={'/my'}
            style={{
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <ZUIText
                style={{
                  marginBottom: '3px',
                }}
                variant="headingLg"
              >
                {title || messages.title()}
              </ZUIText>
            </Box>
          </NextLink>
        }
      />
      <Box minHeight="90dvh">{children}</Box>
      <ZUIPublicFooter />
    </Box>
  );
};

export default HomeLayout;
