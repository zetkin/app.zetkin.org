import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useRef, useState } from 'react';
import {
  Architecture,
  ExpandLess,
  ExpandMore,
  Explore,
  Groups,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowRightOutlined,
  LocalOffer,
  Map,
  Search,
  Settings,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  Menu,
  MenuItem,
  SxProps,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';

import messageIds from '../l10n/messageIds';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useLocalStorage from '../hooks/useLocalStorage';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { MenuItem as ZUIEllipsisMenuItem } from '../ZUIEllipsisMenu';
import OrganizationSwitcher from 'features/organizations/components/OrganizationSwitcher';
import OrganizationFilterField from 'features/organizations/components/OrganizationSwitcher/OrganizationFilterField';
import SearchDialog from 'features/search/components/SearchDialog';
import SidebarListItem from './SidebarListItem';
import SidebarUserFooter, { useUserMenuItems } from './SidebarUserFooter';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS, OFFICIALS } from 'utils/featureFlags';
import oldTheme from 'theme';
import useIsMobile from 'utils/hooks/useIsMobile';
import { ZetkinUser } from 'utils/types/zetkin';

/** Use to visually hide elements while keeping them focusable, allowing a11y tools and keyboard navigation to access the button */
const hiddenYetFocusableStyle: SxProps = {
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  position: 'absolute',
  width: '1px',
};
const unsetHidden: SxProps = {
  clip: 'auto',
  height: 'auto',
  margin: '0',
  overflow: 'visible',
  position: 'relative',
  width: 'auto',
};

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
  const messages = useMessages(messageIds);

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
          aria-label={messages.mobileOrganizeHeader.sideBarMenuButtonDescription()}
          onClick={(e) => {
            openMobileSidebar();
            e.stopPropagation();
          }}
        >
          <MenuIcon />
        </Button>
        <Typography fontSize={'16px'}>{title}</Typography>
      </Box>
      {user && (
        <>
          <Button
            aria-label={messages.mobileOrganizeHeader.userMenuButtonDescription()}
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
              <Typography
                sx={{
                  display: 'block',
                  marginLeft: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.first_name}
              </Typography>
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
                    item.onSelect?.(e as React.MouseEvent<HTMLLIElement>);
                  }}
                >
                  {item.href ? <Link href={item.href}>{inner}</Link> : inner}
                </MenuItem>
              );
            })}
          </Menu>
        </>
      )}
    </Box>
  );
};

const ZUIOrganizeSidebar = ({
  title,
}: {
  title?: string | ReactElement;
}): JSX.Element => {
  const messages = useMessages(messageIds);
  const user = useCurrentUser();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';
  const expandButton = useRef<HTMLButtonElement>(null);
  const collapseButton = useRef<HTMLButtonElement>(null);

  const [checked, setChecked] = useState(false);
  const [lastOpen, setLastOpen] = useLocalStorage('orgSidebarOpen', true);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(isMobile ? true : lastOpen);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const organizationFuture = useOrganization(orgId);
  const hasAreas = useFeature(AREAS, orgId);
  const hasSettings = useFeature(OFFICIALS, orgId);

  const handleExpansion = () => {
    setChecked(!checked);
  };

  const handleClick = () => {
    //remove checked state if menu is collapsed
    if (!open) {
      setChecked(false);
    }
    const nextFocus = open ? expandButton : collapseButton;
    setTimeout(() => {
      if (nextFocus.current) {
        nextFocus.current.focus();
      }
    }, 16);
    setOpen(!open);
    setLastOpen(!open);
  };

  const menuItemsMap = [
    { icon: <Groups />, name: 'people' },
    { icon: <Architecture />, name: 'projects' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <LocalOffer />, name: 'tags' },
    { icon: <Map />, name: 'geography' },
    { icon: <Settings />, name: 'settings' },
  ] as const;

  const userMenuItems = useUserMenuItems();

  const showOrgSwitcher = checked && open;

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const fullDrawerWidth = `${drawerWidth}px`;
  const smallDrawerWidth = `calc(${oldTheme.spacing(isSmall ? 8 : 7)} + 1px)`;

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
          '& .show-on-hover': hiddenYetFocusableStyle,
          // activate when hovered or when a child has focus (e.g. during keyboard navigation)
          '&:hover, &:has(:focus)': {
            '.hide-on-hover': hiddenYetFocusableStyle,
            '.show-on-hover': unsetHidden,
          },
          '.MuiDrawer-paper': {
            display: 'block',
            overflowX: 'hidden',
            width,
          },
          flexShrink: 0,
          transition: oldTheme.transitions.create('width', {
            duration: oldTheme.transitions.duration.enteringScreen,
            easing: oldTheme.transitions.easing.sharp,
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
                justifyContent: open ? 'space-between' : 'center',
                mx: 1,
                my: 1.5,
              }}
            >
              {!open && (
                <>
                  <IconButton
                    ref={expandButton}
                    aria-label={messages.organizeSidebar.expand()}
                    className="show-on-hover"
                    onClick={handleClick}
                  >
                    <KeyboardDoubleArrowRightOutlined />
                  </IconButton>
                  <Avatar
                    alt={messages.organizeSidebar.organizationAvatarAltText()}
                    aria-hidden="true"
                    className="hide-on-hover"
                    src={`/api/orgs/${orgId}/avatar`}
                  />
                </>
              )}
              <ZUIFuture future={organizationFuture}>
                {(data) =>
                  open ? (
                    <>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          overflow: 'hidden',
                        }}
                      >
                        {!showOrgSwitcher && (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                flexShrink: 0,
                                justifyContent: 'center',
                                width: '48px',
                              }}
                            >
                              {!isMobile ? (
                                <>
                                  <IconButton
                                    ref={collapseButton}
                                    aria-label={messages.organizeSidebar.collapse()}
                                    className="show-on-hover"
                                    onClick={handleClick}
                                  >
                                    <KeyboardDoubleArrowLeftOutlined />
                                  </IconButton>
                                  <Avatar
                                    alt={messages.organizeSidebar.organizationAvatarAltText()}
                                    aria-hidden="true"
                                    className="hide-on-hover"
                                    src={`/api/orgs/${orgId}/avatar`}
                                  />
                                </>
                              ) : (
                                <Avatar
                                  alt={messages.organizeSidebar.organizationAvatarAltText()}
                                  src={`/api/orgs/${orgId}/avatar`}
                                />
                              )}
                            </Box>
                            <Typography
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              variant="h6"
                            >
                              {data.title}
                            </Typography>
                          </>
                        )}

                        {showOrgSwitcher && (
                          <OrganizationFilterField
                            onChange={setSearchString}
                            value={searchString}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: open ? 'flex' : 'none' }}>
                        <IconButton
                          aria-label={
                            checked
                              ? messages.organizeSidebar.organizationSwitcher.hide()
                              : messages.organizeSidebar.organizationSwitcher.show()
                          }
                          onClick={handleExpansion}
                        >
                          {checked ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </>
                  ) : null
                }
              </ZUIFuture>
            </Box>
            {checked && (
              <OrganizationSwitcher
                open={showOrgSwitcher}
                orgId={orgId}
                searchString={searchString}
                variant="overlay"
              />
            )}
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
              <SearchDialog
                activator={(openDialog) => (
                  <Tooltip
                    arrow
                    placement="right"
                    title={
                      !open ? messages.organizeSidebar['search']() : undefined
                    }
                  >
                    <SidebarListItem
                      data-testid="SearchDialog-activator"
                      icon={<Search />}
                      name="search"
                      onClick={openDialog}
                      open={open}
                    />
                  </Tooltip>
                )}
              />
              {menuItemsMap.map(({ name, icon }) => {
                if (name == 'geography' && !hasAreas) {
                  return null;
                }
                if (name == 'settings' && !hasSettings) {
                  return null;
                }

                return (
                  <NextLink
                    key={name}
                    href={`/organize/${orgId}/${name}`}
                    legacyBehavior
                    passHref
                  >
                    <Tooltip
                      arrow
                      placement="right"
                      title={
                        !open ? messages.organizeSidebar[name]() : undefined
                      }
                    >
                      <SidebarListItem
                        key={name}
                        icon={icon}
                        name={name}
                        open={open}
                        selected={key.startsWith('/' + name)}
                      />
                    </Tooltip>
                  </NextLink>
                );
              })}
            </List>
          </Box>
          <SidebarUserFooter open={open} />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ZUIOrganizeSidebar;
