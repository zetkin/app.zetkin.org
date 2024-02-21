import makeStyles from '@mui/styles/makeStyles';
import { Menu } from '@mui/icons-material/';
import NextLink from 'next/link';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
} from '@mui/material';

import ZUILogo from './ZUILogo';

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

const ZUIOrganizeSidebarNoMenu = (): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
            <NextLink href="/organize" legacyBehavior passHref>
              <IconButton
                aria-label="Home"
                className={classes.roundButton}
                color={'primary'}
                data-test="logo-button"
                size="large"
                style={{ marginBottom: '2rem' }}
              >
                <ZUILogo beta={true} htmlColor="#ED1C55" size={40} />
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

export default ZUIOrganizeSidebarNoMenu;
