import makeStyles from '@mui/styles/makeStyles';
import messageIds from '../l10n/messageIds';
import NextLink from 'next/link';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import OrganizationTree from 'features/organizations/components/OrganizationTree';
import { RootState } from 'core/store';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useLocalStorage from '../hooks/useLocalStorage';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import ZUIAvatar from '../ZUIAvatar';
import ZUIEllipsisMenu from '../ZUIEllipsisMenu';
import ZUIFuture from '../ZUIFuture';
import {
  Architecture,
  ExpandLess,
  ExpandMore,
  Explore,
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
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import SearchDialog from 'features/search/components/SearchDialog';
import SidebarListItem from './SidebarListItem';
import RecentOrganizations, {
  RecentOrganization,
} from 'features/organizations/components/RecentOrganizations';

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
  const theme = useTheme();
  const user = useCurrentUser();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';
  const [checked, setChecked] = useState(false);

  const [lastOpen, setLastOpen] = useLocalStorage('orgSidebarOpen', true);
  const [recentOrganizations, setRecentOrganizations] = useLocalStorage(
    'recentOrganizations',
    [] as RecentOrganization[]
  );
  const [open, setOpen] = useState(false);
  const model: OrganizationsDataModel = useModel(
    (env) => new OrganizationsDataModel(env)
  );

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

  const handleExpansion = () => {
    model.getOrganizationsTree();
    setChecked(!checked);
  };

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  const treeDataList = useSelector(
    (state: RootState) => state.organizations.treeDataList
  );

  const orgData = treeDataList.items.map((item) => item.data).filter(notEmpty);

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

              {open && (
                <ZUIFuture future={model.getOrganization(orgId)}>
                  {(data) => (
                    <>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
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
                        <Typography variant="h6">{data.title}</Typography>
                      </Box>
                      <Box sx={{ display: open ? 'flex' : 'none' }}>
                        <IconButton onClick={handleExpansion}>
                          {checked ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </>
                  )}
                </ZUIFuture>
              )}
            </Box>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottomColor: showOrgSwitcher
                  ? 'transparent'
                  : theme.palette.grey[300],
                borderBottomStyle: 'solid',
                borderBottomWidth: 1,
                height: showOrgSwitcher ? 'calc(100% - 130px)' : 0,
                overflowY: 'auto',
                position: 'absolute',
                transition: theme.transitions.create(
                  ['borderBottomColor', 'height'],
                  {
                    duration: theme.transitions.duration.short,
                    easing: theme.transitions.easing.sharp,
                  }
                ),
                width: '100%',
                zIndex: 1000,
              }}
            >
              {recentOrganizations.filter((recentOrg) => recentOrg.id != orgId)
                .length > 0 && (
                <Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={12} m={1} variant="body2">
                      {messages.organizeSidebar
                        .recentOrganizations()
                        .toLocaleUpperCase()}
                    </Typography>
                    <Button
                      onClick={() => setRecentOrganizations([])}
                      variant="text"
                    >
                      {messages.organizeSidebar.clearRecentOrganizations()}
                    </Button>
                  </Box>
                  <RecentOrganizations
                    orgId={orgId}
                    recentOrganizations={recentOrganizations.filter(
                      (recentOrg) => recentOrg.id != orgId
                    )}
                  />
                </Box>
              )}
              {orgData.length > 0 && (
                <ZUIFuture future={model.getOrganization(orgId)}>
                  {(data) => (
                    <Box>
                      <Typography fontSize={12} m={1} variant="body2">
                        {messages.organizeSidebar
                          .allOrganizations()
                          .toLocaleUpperCase()}
                      </Typography>
                      <OrganizationTree
                        onSwitchOrg={() =>
                          setRecentOrganizations([
                            ...recentOrganizations,
                            { id: orgId, title: data.title },
                          ])
                        }
                        orgId={orgId}
                        treeItemData={orgData}
                      />
                    </Box>
                  )}
                </ZUIFuture>
              )}
              {treeDataList.isLoading && (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', margin: 3 }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
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
                    <ZUIAvatar
                      orgId={orgId}
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
