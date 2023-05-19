import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MuiDrawer from '@mui/material/Drawer';
import NextLink from 'next/link';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { Event, Explore, Home, Map, People } from '@mui/icons-material/';

import messageIds from './l10n/messageIds';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIFuture from './ZUIFuture';

const drawerWidth = 240;

const closedMixin = (theme: Theme): CSSObject => ({
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.leavingScreen,
    easing: theme.transitions.easing.sharp,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const openedMixin = (theme: Theme): CSSObject => ({
  overflowX: 'hidden',
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.sharp,
  }),
  width: drawerWidth,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  boxSizing: 'border-box',
  flexShrink: 0,
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
  whiteSpace: 'nowrap',
  width: drawerWidth,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messages = useMessages(messageIds);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
    setExpanded(!expanded);
  };

  const model = useModel((env) => new OrganizationsDataModel(env));

  const menuItemsMap = [
    { icon: <Map />, name: 'areas' },
    { icon: <Home />, name: 'home' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <People />, name: 'people' },
    { icon: <Event />, name: 'projects' },
  ] as const;

  const OrganizeSideBar = (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        onFocus={() => void 0}
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        open={open}
        sx={{
          alignItems: open ? 'flex-start' : 'center',
        }}
        variant="permanent"
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {!open && hover && !expanded && (
              <KeyboardDoubleArrowRightIcon
                onClick={toggleDrawer}
                sx={{ margin: 1 }}
              />
            )}
            {!open && !hover && !expanded && (
              <NextLink href="/organize" passHref>
                <Avatar
                  alt="icon"
                  src={`/api/orgs/${orgId}/avatar`}
                  sx={{ alignSelf: 'center' }}
                />
              </NextLink>
            )}
            {expanded && (
              <ZUIFuture future={model.getOrganization(orgId)}>
                {(data) => {
                  return (
                    <Box alignSelf="center">
                      <Box display="flex" justifyContent="start">
                        {hover ? (
                          <ChevronLeftIcon
                            onClick={handleDrawerToggle}
                            sx={{ alignSelf: 'center', margin: 2 }}
                          />
                        ) : (
                          <Avatar
                            alt="icon"
                            src={`/api/orgs/${orgId}/avatar`}
                            sx={{ alignSelf: 'center', marginLeft: 2 }}
                          />
                        )}
                        <Typography gutterBottom m={2} variant="h6">
                          {data.title}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              </ZUIFuture>
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItemsMap.map((item) => (
            <ListItem
              key={item.name}
              disableGutters
              disablePadding
              sx={{ display: 'block' }}
            >
              <NextLink
                href={
                  item.name === 'home'
                    ? '/organize/'
                    : `/organize/${orgId}/${item.name}`
                }
                passHref
              >
                <IconButton
                  color={
                    key.startsWith('/' + item.name) ? 'primary' : 'secondary'
                  }
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    minHeight: 48,
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: 'center',
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                    }}
                  />
                  {item.icon}
                  <ListItemText
                    primary={messages.organizeSidebar[item.name]()}
                    sx={{ marginLeft: 3, opacity: open ? 1 : 0 }}
                  />
                </IconButton>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );

  return OrganizeSideBar;
};

export default ZUIOrganizeSidebar;
