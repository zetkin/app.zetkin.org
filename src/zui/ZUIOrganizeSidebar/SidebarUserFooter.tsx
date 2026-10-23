import Link from 'next/link';
import { Logout } from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu, {
  MenuItem as ZUIEllipsisMenuItem,
} from '../ZUIEllipsisMenu';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';

export const useUserMenuItems = (): ZUIEllipsisMenuItem[] => {
  const messages = useMessages(messageIds);

  return [
    {
      href: '/my',
      label: messages.organizeSidebar.myPagesMenuItemLabel(),
    },
    {
      divider: true,
      href: '/my/settings',
      label: messages.organizeSidebar.mySettingsMenuItemLabel(),
    },
    {
      href: '/logout',
      label: messages.organizeSidebar.signOut(),
      startIcon: <Logout />,
    },
  ];
};

const SidebarUserFooter = ({ open }: { open: boolean }): JSX.Element => {
  const messages = useMessages(messageIds);
  const user = useCurrentUser();
  const userMenuItems = useUserMenuItems();

  return (
    <Box flexGrow={0}>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mx: open ? 1 : 0.5,
          my: 0.5,
          py: open ? 1.25 : 1,
        }}
      >
        {user && (
          <>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mx: 1,
                width: '48px',
              }}
            >
              <Tooltip
                arrow
                placement={open ? 'top' : 'right'}
                title={messages.organizeSidebar.myPagesInfoText()}
              >
                <Link href="/my">
                  <Box sx={{ alignItems: 'center', display: 'flex' }}>
                    <ZUIUserAvatar
                      personId={user.id}
                      size={open ? 'sm' : 'md'}
                    />
                    <Typography
                      sx={{
                        display: open ? 'flex' : 'none',
                        marginLeft: 1,
                      }}
                    >
                      {user.first_name}
                    </Typography>
                  </Box>
                </Link>
              </Tooltip>
            </Box>
            <Box
              sx={{
                justifyContent: 'flex-end',
              }}
            >
              {open && (
                <ZUIEllipsisMenu
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  items={userMenuItems}
                  transformOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                  }}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarUserFooter;
