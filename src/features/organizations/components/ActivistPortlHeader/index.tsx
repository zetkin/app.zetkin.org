import { Box, Button } from '@mui/material';
import { FC, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
  title: string | JSX.Element;
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
  const path = usePathname();

  const menuItems: MenuItem[] = [
    {
      label: messages.home.menu.logout(),
      onClick: () => router.push('/logout'),
    },
  ];
  if (!path?.startsWith('/my')) {
    menuItems.unshift({
      divider: true,
      label: process.env.HOME_TITLE || messages.home.menu.myZetkin(),
      onClick: () => router.push('/my'),
    });
  }

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
          padding: 2,
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
                  label={messages.home.header.goToOrganizerAppButtonLabel()}
                />
              )}
              <Button
                onClick={(event) => setLogoutMenuAnchorEl(event.currentTarget)}
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
                menuItems={menuItems}
                onClose={() => setLogoutMenuAnchorEl(null)}
              />
            </Box>
          )}
        </Box>
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
        {subtitle && (
          <Box>
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
