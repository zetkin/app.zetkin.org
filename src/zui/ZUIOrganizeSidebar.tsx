import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiDrawer from '@mui/material/Drawer';
import NextLink from 'next/link';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Architecture,
  Explore,
  KeyboardDoubleArrowRight,
  Map,
  People,
} from '@mui/icons-material/';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import messageIds from './l10n/messageIds';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIFuture from './ZUIFuture';

const drawerWidth = 300;

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

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      width: drawerWidth,
    },
  },
  drawerPaper: {
    display: 'none',
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  roundButton: {
    height: '3rem',
    width: '3rem',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const model: OrganizationsDataModel = useModel(
    (env) => new OrganizationsDataModel(env)
  );

  const menuItemsMap = [
    { icon: <People />, name: 'people' },
    { icon: <Architecture />, name: 'projects' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <Map />, name: 'areas' },
  ] as const;

  return (
    <Box data-testid="organize-sidebar" sx={{ display: 'flex' }}>
      <Drawer
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
          {!open && hover && (
            <IconButton onClick={toggleDrawer}>
              <KeyboardDoubleArrowRight
                sx={{ alignSelf: 'center', marginLeft: 0.5 }}
              />
            </IconButton>
          )}
          {!open && !hover && (
            <NextLink href="/organize" passHref>
              <Avatar
                alt="icon"
                src={`/api/orgs/${orgId}/avatar`}
                sx={{ alignSelf: 'center', marginLeft: 0.5 }}
              />
            </NextLink>
          )}
          {open && (
            <ZUIFuture future={model.getOrganization(orgId)}>
              {(data) => {
                return (
                  <Box alignSelf="center">
                    <Box display="flex" justifyContent="start">
                      {hover ? (
                        <IconButton onClick={toggleDrawer}>
                          <ChevronLeftIcon
                            onClick={handleDrawerToggle}
                            sx={{ alignSelf: 'center', marginLeft: 2 }}
                          />
                        </IconButton>
                      ) : (
                        <Avatar
                          alt="icon"
                          src={`/api/orgs/${orgId}/avatar`}
                          sx={{ alignSelf: 'center', marginLeft: 2 }}
                        />
                      )}
                      <Typography gutterBottom m={1} variant="h6">
                        {data.title}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
            </ZUIFuture>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {menuItemsMap.map((item) => (
            <ListItem
              key={item.name}
              disableGutters
              disablePadding
              sx={{
                display: 'block',
              }}
            >
              <NextLink href={`/organize/${orgId}/${item.name}`} passHref>
                <IconButton
                  className={classes.roundButton}
                  size="large"
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    minHeight: 48,
                    ml: open ? 1 : 2,
                    mr: open ? 2 : 1,
                    px: 2.5,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: key.startsWith('/' + item.name)
                        ? theme.palette.grey[300]
                        : 'transparent',
                      borderRadius: '20%',
                      color: theme.palette.grey[500],
                    }}
                    variant="square"
                  >
                    {item.icon}
                  </Avatar>
                  <ListItemText
                    primary={messages.organizeSidebar[item.name]()}
                    sx={{ marginLeft: 2, opacity: open ? 1 : 0 }}
                  />
                </IconButton>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default ZUIOrganizeSidebar;
