import { Box, Button } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Event,
  Home,
  Logout,
  Settings,
} from '@mui/icons-material';
import NextLink from 'next/link';

import messageIds from 'features/organizations/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUITabbedNavBar, {
  ZUITabbedNavBarProps,
} from 'zui/components/ZUITabbedNavBar';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useUser from 'core/hooks/useUser';
import { useMessages } from 'core/i18n';
import ZUIMenu, { MenuItem } from 'zui/components/ZUIMenu';

type Props = {
  button?: JSX.Element;
  noHomeChevron?: boolean; // disable the arrow pointing left that brings users home
  selectedTab?: string;
  subtitle?: string | JSX.Element;
  tabs?: ZUITabbedNavBarProps['items'];
  title?: string | JSX.Element;
  topLeftComponent?: JSX.Element;
};

const ActivistPortalHeader: FC<Props> = ({
  tabs,
  button,
  selectedTab,
  subtitle,
  title,
  topLeftComponent,
  noHomeChevron,
}) => {
  const user = useUser();
  const messages = useMessages(messageIds);

  const hasNavBar = selectedTab && tabs;
  const [logoutMenuAnchorEl, setLogoutMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        divider: true,
        label: messages.home.menu.myActivities(),
        onClick: () => router.push('/my/home'),
        startIcon: Home,
      },
      {
        divider: true,
        label: messages.home.menu.allEvents(),
        onClick: () => router.push('/my/feed'),
        startIcon: Event,
      },
      {
        divider: true,
        label: messages.home.menu.settings(),
        onClick: () => router.push('/my/settings'),
        startIcon: Settings,
      },
      {
        label: messages.home.menu.logout(),
        onClick: () => router.push('/logout'),
        startIcon: Logout,
      },
    ],
    [messages, router]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingBottom: title ? 2 : 0,
          paddingTop: 2,
          paddingX: 2,
          width: '100%',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          {!noHomeChevron && (
            <NextLink
              href={'/my'}
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft />
            </NextLink>
          )}
          {topLeftComponent}
          {user && (
            <>
              <Button
                onClick={(event) => setLogoutMenuAnchorEl(event.currentTarget)}
                sx={{
                  marginLeft: 'auto',
                }}
              >
                <ZUIPersonAvatar
                  firstName={user.first_name}
                  id={user.id}
                  isUser
                  lastName={user.last_name}
                />
              </Button>
              <ZUIMenu
                anchorEl={logoutMenuAnchorEl}
                invertHorizontalAnchor={true}
                menuItems={menuItems}
                onClose={() => setLogoutMenuAnchorEl(null)}
              />
            </>
          )}
        </Box>
        {title && (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              {typeof title == 'string' ? (
                <ZUIText variant="headingLg">{title}</ZUIText>
              ) : (
                title
              )}
            </Box>
            {button && button}
          </Box>
        )}
        {subtitle && (
          <Box sx={{ whiteSpace: 'pre-line' }}>
            {typeof subtitle == 'string' ? (
              <ZUIText>{subtitle}</ZUIText>
            ) : (
              subtitle
            )}
          </Box>
        )}
      </Box>
      {hasNavBar && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <ZUITabbedNavBar items={tabs} selectedTab={selectedTab} />
        </Box>
      )}
    </Box>
  );
};

export default ActivistPortalHeader;
