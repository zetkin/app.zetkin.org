import { Box, Button } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logout } from '@mui/icons-material';

import messageIds from 'features/organizations/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUITabbedNavBar, {
  ZUITabbedNavBarProps,
} from 'zui/components/ZUITabbedNavBar';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import useUser from 'core/hooks/useUser';
import { useMessages } from 'core/i18n';
import ZUIMenu, { MenuItem } from 'zui/components/ZUIMenu';
import ZUIButton from 'zui/components/ZUIButton';
import useMemberships from 'features/organizations/hooks/useMemberships';

type Props = {
  button?: JSX.Element;
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
        label: messages.home.menu.myActivities(),
        onClick: () => router.push('/my/home'),
      },
      {
        label: messages.home.menu.allEvents(),
        onClick: () => router.push('/my/feed'),
      },
      {
        divider: true,
        label: messages.home.menu.settings(),
        onClick: () => router.push('/my/settings'),
      },
      {
        label: messages.home.menu.logout(),
        onClick: () => router.push('/logout'),
        startIcon: Logout,
      },
    ],
    [messages, router]
  );

  const memberships = useMemberships().data || [];
  const isOfficial = memberships.find((membership) => membership.role != null);

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
            justifyContent: topLeftComponent ? 'space-between' : 'flex-end',
          }}
        >
          {topLeftComponent}
          {user && (
            <Box>
              {isOfficial && (
                <ZUIButton
                  href="/organize"
                  label={messages.home.header.organize()}
                />
              )}
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
            </Box>
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
          <Box>
            {typeof subtitle == 'string' ? (
              <ZUIText renderLineBreaks={true}>{subtitle}</ZUIText>
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
