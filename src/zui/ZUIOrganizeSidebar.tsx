import NextLink from 'next/link';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
} from '@mui/material';
import { Event, Explore, Home, Map, Menu, People } from '@mui/icons-material/';

import makeStyles from '@mui/styles/makeStyles';

const drawerWidth = '5rem';

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
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
  root: {
    display: 'flex',
  },
  roundButton: {
    background: 'white',
    borderRadius: '50%',
    height: '3rem',
    width: '3rem',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const router = useRouter();
  const { orgId } = useNumericRouteParams();

  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const drawer = (
    <Box
      alignItems="center"
      data-testid="organize-sidebar"
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
    >
      <List disablePadding>
        <Box display="flex" flexDirection="column">
          <ListItem disableGutters>
            <NextLink href="/organize" passHref>
              <IconButton
                aria-label="Home"
                className={classes.roundButton}
                color={key === 'organize' ? 'primary' : 'secondary'}
                data-test="logo-button"
                size="large"
                style={{ marginBottom: '2rem' }}
              >
                <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
              </IconButton>
            </NextLink>
          </ListItem>
          <ListItem disableGutters>
            <NextLink href="/organize/" passHref>
              <IconButton
                aria-label="Home"
                className={classes.roundButton}
                color={key === '' ? 'primary' : 'secondary'}
                data-test="home-button"
                size="large"
              >
                <Home />
              </IconButton>
            </NextLink>
          </ListItem>
          <ListItem disableGutters>
            <NextLink href={`/organize/${orgId}/people`} passHref>
              <IconButton
                aria-label="People"
                className={classes.roundButton}
                color={key.startsWith('/people') ? 'primary' : 'secondary'}
                data-test="people-button"
                size="large"
              >
                <People />
              </IconButton>
            </NextLink>
          </ListItem>
          <ListItem disableGutters>
            <NextLink href={`/organize/${orgId}/journeys`} passHref>
              <IconButton
                aria-label="Journeys"
                className={classes.roundButton}
                color={key.startsWith('/journeys') ? 'primary' : 'secondary'}
                data-test="people-button"
                size="large"
              >
                <Explore />
              </IconButton>
            </NextLink>
          </ListItem>
          <ListItem disableGutters>
            <NextLink href={`/organize/${orgId}/areas`} passHref>
              <IconButton
                aria-label="Areas"
                className={classes.roundButton}
                color={key.startsWith('/areas') ? 'primary' : 'secondary'}
                data-test="area-button"
                size="large"
              >
                <Map />
              </IconButton>
            </NextLink>
          </ListItem>
          <ListItem disableGutters>
            <NextLink href={`/organize/${orgId}/projects`} passHref>
              <IconButton
                aria-label="Projects"
                className={classes.roundButton}
                color={key.startsWith('/projects') ? 'primary' : 'secondary'}
                data-test="calendar-button"
                size="large"
              >
                <Event />
              </IconButton>
            </NextLink>
          </ListItem>
        </Box>
      </List>
    </Box>
  );

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            className={classes.menuButton}
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            size="large"
          >
            <Menu data-test="menu-button" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav aria-label="mailbox folders" className={classes.drawer}>
        <Drawer
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          onClose={handleDrawerToggle}
          open={mobileOpen}
          variant="temporary"
        >
          {drawer}
        </Drawer>

        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          open
          variant="permanent"
        >
          {drawer}
        </Drawer>
      </nav>
    </div>
  );
};

export default ZUIOrganizeSidebar;
