import makeStyles from '@mui/styles/makeStyles';
import messageIds from '../l10n/messageIds';
import NextLink from 'next/link';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useLocalStorage from '../hooks/useLocalStorage';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import ZUIEllipsisMenu from '../ZUIEllipsisMenu';
import {
  Architecture,
  Close,
  ExpandLess,
  ExpandMore,
  Explore,
  FilterListOutlined,
  Groups,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowRightOutlined,
  Logout,
  Map,
  Search,
} from '@mui/icons-material/';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import OrganizationSwitcher from 'features/organizations/components/OrganizationSwitcher';
import SearchDialog from 'features/search/components/SearchDialog';
import SidebarListItem from './SidebarListItem';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useOrganizationsTree from 'features/organizations/hooks/useOrganizationsTree';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIUserAvatar from 'zui/ZUIUserAvatar';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerPaper: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: drawerWidth,
  },
  toggleDrawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const [hover, setHover] = useState(false);
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const user = useCurrentUser();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const [checked, setChecked] = useState(false);
  const [lastOpen, setLastOpen] = useLocalStorage('orgSidebarOpen', true);
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState('');

  const handleExpansion = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    if (lastOpen != open) {
      setOpen(lastOpen);
    }
  }, []);

  const handleClick = () => {
    //remove checked state if menu is collapsed
    if (!open) {
      setChecked(false);
    }
    setOpen(!open);
    setLastOpen(!open);
  };

  const menuItemsMap = [
    { icon: <Groups />, name: 'people' },
    { icon: <Architecture />, name: 'projects' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <Map />, name: 'areas' },
  ] as const;

  function logOut() {
    router.push(`/logout`);
  }

  const showOrgSwitcher = checked && open;

  return (
    <Box data-testid="organize-sidebar">
      <Drawer
        classes={{
          paper:
            classes.drawerPaper +
            (!open ? ` ${classes.toggleDrawerPaper}` : ''),
        }}
        className={
          classes.drawer + (!open ? ` ${classes.toggleDrawerPaper}` : '')
        }
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        open={open}
        variant="permanent"
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
              {!open && hover && (
                <IconButton onClick={handleClick}>
                  <KeyboardDoubleArrowRightOutlined />
                </IconButton>
              )}
              {!open && !hover && (
                <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
              )}
              <ZUIFuture future={useOrganizationsTree()}>
                <ZUIFuture future={useOrganization(orgId)}>
                  {(data) => (
                    <>
                      {open && (
                        <>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            {!showOrgSwitcher && (
                              <>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '48px',
                                  }}
                                >
                                  {hover ? (
                                    <IconButton onClick={handleClick}>
                                      <KeyboardDoubleArrowLeftOutlined />
                                    </IconButton>
                                  ) : (
                                    <Avatar
                                      alt="icon"
                                      src={`/api/orgs/${orgId}/avatar`}
                                    />
                                  )}
                                </Box>
                                <Typography variant="h6">
                                  {data.title}
                                </Typography>
                              </>
                            )}

                            {showOrgSwitcher && (
                              <TextField
                                fullWidth
                                InputProps={{
                                  endAdornment:
                                    searchString.length > 0 ? (
                                      <Close
                                        color="secondary"
                                        onClick={() => setSearchString('')}
                                        sx={{ cursor: 'pointer' }}
                                      />
                                    ) : (
                                      ''
                                    ),
                                  startAdornment: (
                                    <FilterListOutlined
                                      color="secondary"
                                      sx={{ marginRight: '0.5em' }}
                                    />
                                  ),
                                }}
                                onChange={(e) =>
                                  setSearchString(e.target.value)
                                }
                                placeholder={messages.organizeSidebar.filter()}
                                value={searchString}
                              />
                            )}
                          </Box>

                          <Box sx={{ display: open ? 'flex' : 'none' }}>
                            <IconButton onClick={handleExpansion}>
                              {checked ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </ZUIFuture>
              </ZUIFuture>
            </Box>
            <OrganizationSwitcher
              open={showOrgSwitcher}
              orgId={orgId}
              searchString={searchString}
            />
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
                return (
                  <NextLink
                    key={name}
                    href={`/organize/${orgId}/${name}`}
                    passHref
                  >
                    <Tooltip
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
                  <Box
                    sx={{
                      justifyContent: 'flex-end',
                    }}
                  >
                    <ZUIEllipsisMenu
                      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                      items={[
                        {
                          label: (
                            <Typography>
                              {messages.organizeSidebar.signOut()}
                            </Typography>
                          ),
                          onSelect: () => {
                            logOut();
                          },
                          startIcon: <Logout />,
                        },
                      ]}
                      transformOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom',
                      }}
                    />
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

export default ZUIOrganizeSidebar;
