'use client';

import NextLink from 'next/link';
import {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Groups,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowRightOutlined,
  Logout,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';

import SidebarListItem from 'features/manage/components/ManageSidebar/SidebarListItem';
import messageIds from 'features/manage/l10n/messageIds';
import zuiMessageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu, {
  MenuItem as ZUIEllipsisMenuItem,
} from 'zui/ZUIEllipsisMenu';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';
import useIsMobile from 'utils/hooks/useIsMobile';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import useUser from 'core/hooks/useUser';
import useCookie from 'zui/hooks/useCookie';

const drawerWidth = 300;

const ZUIOrganizeMobileHeader = ({
  openMobileSidebar,
  title,
  user,
  userMenuItems,
}: {
  openMobileSidebar: () => void;
  title?: string | ReactElement;
  user: ZetkinUser | null;
  userMenuItems: ZUIEllipsisMenuItem[];
}) => {
  const [mobileUserMenuAnchor, setMobileUserMenuAnchor] =
    useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const zuiMessages = useMessages(zuiMessageIds);

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.grey['300']}`,
        display: 'flex',
        flexDirection: 'row',
        height: '3.5rem',
        justifyContent: 'space-between',
        left: 0,
        padding: '0 5px',
        pointerEvents: 'all',
        position: 'absolute',
        top: 0,
        width: '100vw',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button
          aria-label={zuiMessages.mobileOrganizeHeader.sideBarMenuButtonDescription()}
          onClick={(e) => {
            openMobileSidebar();
            e.stopPropagation();
          }}
        >
          <MenuIcon />
        </Button>
        <ZUIText variant="headingMd">{title}</ZUIText>
      </Box>
      {user && (
        <>
          <Button
            aria-label={zuiMessages.mobileOrganizeHeader.userMenuButtonDescription()}
            onClick={(event) => setMobileUserMenuAnchor(event.currentTarget)}
          >
            <ZUIUserAvatar personId={user.id} size={'sm'} />
          </Button>
          <Menu
            anchorEl={mobileUserMenuAnchor}
            onClose={() => setMobileUserMenuAnchor(null)}
            open={Boolean(mobileUserMenuAnchor)}
          >
            <Box
              sx={{
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                display: 'flex',
                maxWidth: '50vw',
                minWidth: '150px',
                padding: '10px 16px',
                width: '100%',
              }}
            >
              <ZUIUserAvatar personId={user.id} size={'sm'} />
              <ZUIText
                sx={{
                  display: 'block',
                  marginLeft: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                variant="bodyMdSemiBold"
              >
                {user.first_name}
              </ZUIText>
            </Box>
            {userMenuItems.map((item, index) => {
              const inner = (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                  }}
                >
                  {item.startIcon}
                  {item.label}
                </Box>
              );
              return (
                <MenuItem
                  key={index}
                  divider={item.divider}
                  onClick={(e) => {
                    item.onSelect?.(e as MouseEvent<HTMLLIElement>);
                  }}
                >
                  {item.href ? (
                    <Link
                      component={NextLink}
                      href={item.href}
                      sx={{ textDecoration: 'none' }}
                    >
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </Box>
  );
};

const menuItemsMap = [{ icon: <Groups />, name: 'users' }] as const;

const ManageSidebar = ({
  title,
  sidebarOpenInitialCookieValue,
  segment,
}: {
  segment: 'users';
  sidebarOpenInitialCookieValue?: boolean;
  title?: string | ReactElement;
}): ReactNode => {
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const user = useUser();
  const expandButton = useRef<HTMLButtonElement>(null);
  const collapseButton = useRef<HTMLButtonElement>(null);

  const [lastOpen, setLastOpen] = useCookie(
    'sidebarOpen',
    true,
    sidebarOpenInitialCookieValue
  );
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(isMobile ? true : lastOpen);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false);
      setOpen(false);
      setLastOpen(false);
      return;
    }

    const nextFocus = open ? expandButton : collapseButton;
    setTimeout(() => {
      if (nextFocus.current) {
        nextFocus.current.focus();
      }
    }, 16);
    setOpen(!open);
    setLastOpen(!open);
  }, [mobileDrawerOpen, open, setLastOpen]);

  const userMenuItems = useMemo(
    () => [
      {
        href: '/my',
        label: zuiMessages.organizeSidebar.myPagesMenuItemLabel(),
      },
      {
        divider: true,
        href: '/my/settings',
        label: zuiMessages.organizeSidebar.mySettingsMenuItemLabel(),
      },
      {
        href: '/logout',
        label: zuiMessages.organizeSidebar.signOut(),
        startIcon: <Logout />,
      },
    ],
    [zuiMessages]
  );

  const theme = useTheme();
  const fullDrawerWidth = `${drawerWidth}px`;
  const smallDrawerWidth = `calc(${theme.spacing(8)} + 1px)`;

  let width = fullDrawerWidth;
  if (!isMobile && !open) {
    width = smallDrawerWidth;
  }

  return (
    <Box data-testid="organize-sidebar">
      {isMobile && (
        <ZUIOrganizeMobileHeader
          openMobileSidebar={() => {
            setMobileDrawerOpen(true);
            setOpen(true);
            setLastOpen(true);
          }}
          title={title}
          user={user}
          userMenuItems={userMenuItems}
        />
      )}
      <Drawer
        anchor={'left'}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        sx={{
          '.MuiDrawer-paper': {
            display: 'block',
            overflowX: 'hidden',
            width,
          },
          flexShrink: 0,
          transition: theme.transitions.create('width', {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.sharp,
          }),
          whiteSpace: 'nowrap',
          width,
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: open ? 'flex-start' : 'center',
                mx: 1,
                my: 1.5,
              }}
            >
              <IconButton
                ref={expandButton}
                aria-label={zuiMessages.organizeSidebar.expand()}
                className="show-on-hover"
                onClick={handleClick}
              >
                {open ? (
                  <KeyboardDoubleArrowLeftOutlined />
                ) : (
                  <KeyboardDoubleArrowRightOutlined />
                )}
              </IconButton>
              {open ? (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    overflow: 'hidden',
                  }}
                >
                  <ZUIText variant="headingMd">{title}</ZUIText>
                </Box>
              ) : null}
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <List
              sx={{
                mx: 1,
              }}
            >
              {menuItemsMap.map(({ name, icon }) => {
                return (
                  <Link
                    key={name}
                    component={NextLink}
                    href={`/manage/${name}`}
                    passHref
                    sx={{ textDecoration: 'none' }}
                  >
                    <Tooltip
                      arrow
                      placement="right"
                      title={
                        !open ? messages.manageSidebar.items[name]() : undefined
                      }
                    >
                      <SidebarListItem
                        key={name}
                        icon={icon}
                        name={name}
                        open={open}
                        selected={segment === name}
                      />
                    </Tooltip>
                  </Link>
                );
              })}
            </List>
          </Box>
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
                      title={zuiMessages.organizeSidebar.myPagesInfoText()}
                    >
                      <Link
                        component={NextLink}
                        href="/my"
                        sx={{
                          textDecoration: 'none',
                        }}
                      >
                        <Box sx={{ alignItems: 'center', display: 'flex' }}>
                          <ZUIUserAvatar
                            personId={user.id}
                            size={open ? 'sm' : 'md'}
                          />
                          <ZUIText
                            sx={{
                              display: open ? 'flex' : 'none',
                              marginLeft: 1,
                            }}
                            variant="bodyMdSemiBold"
                          >
                            {user.first_name}
                          </ZUIText>
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
        </Box>
      </Drawer>
    </Box>
  );
};

export default ManageSidebar;
